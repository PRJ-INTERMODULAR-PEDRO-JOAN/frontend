<template>
  <MainLayout>
    <main class="contenido-principal" style="padding-top: 50px; min-height: 100vh;">
      <div class="container">
        
        <div class="row mb-5 gy-3 align-items-end">
          <div class="col-lg-4 col-md-12 text-center text-lg-start">
              <h1 class="display-5 fw-bold mb-0">Catálogo</h1>
              <p class="lead text-muted mb-0">Encuentra tu maqueta ideal</p>
          </div>
          
          <div class="col-lg-8 col-md-12">
            <div class="row g-2 align-items-end">
              <div class="col-md-4">
                <label class="form-label small fw-bold text-muted">Buscar</label>
                <input type="text" class="form-control shadow-sm" v-model="searchQuery" placeholder="Ej. Coche...">
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-bold text-muted">Categoría</label>
                <select class="form-select shadow-sm" v-model="selectedCategory">
                  <option value="">Todas</option>
                  <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-bold text-muted">Ordenar</label>
                <select class="form-select shadow-sm" v-model="sortOrder">
                  <option value="default">Relevancia</option>
                  <option value="low">Menor Precio</option>
                  <option value="high">Mayor Precio</option>
                </select>
              </div>
              <div class="col-md-2 d-flex justify-content-end">
                <div class="btn-group shadow-sm w-100">
                  <button class="btn" :class="viewMode === 'grid' ? 'btn-dark' : 'btn-outline-secondary'" @click="viewMode = 'grid'" title="Vista Cuadrícula">🔲</button>
                  <button class="btn" :class="viewMode === 'list' ? 'btn-dark' : 'btn-outline-secondary'" @click="viewMode = 'list'" title="Vista Lista">☰</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="alert alert-warning text-center shadow-sm py-4">
          <p class="mb-0 fs-5">No hay productos que coincidan con tus filtros.</p>
          <button class="btn btn-sm btn-outline-warning mt-2" @click="resetFilters">Limpiar filtros</button>
        </div>

        <div v-else :class="viewMode === 'grid' ? 'contenedor-productos' : 'contenedor-productos-lista'">
            <div v-for="product in filteredProducts" :key="product.id" class="tarjeta-producto shadow-sm" :class="[viewMode === 'list' ? 'tarjeta-lista' : '', product.stock <= 0 ? 'agotado' : '']">
                
                <div v-if="product.stock <= 0" class="overlay-agotado"><span class="badge-agotado">AGOTADO</span></div>
                
                <div class="imagen-container">
                  <img :src="getImagePath(product.image)" :alt="product.name" class="imagen-maqueta" :style="product.stock <= 0 ? 'filter: grayscale(100%); opacity: 0.5;' : ''">
                </div>
                
                <div class="info-container d-flex flex-column h-100 w-100">
                  <h3 class="mt-3 mt-md-0 fw-bold">{{ product.name }}</h3>
                  <p class="producto-descripcion text-muted mb-3">{{ viewMode === 'grid' ? truncate(product.description, 90) : product.description }}</p>
                  
                  <div class="mt-auto d-flex justify-content-between align-items-center mb-3 w-100">
                      <span class="producto-precio text-success fw-bold fs-4">{{ formatPrice(product.price) }}</span>
                      <small v-if="product.stock > 0 && product.stock <= 5" class="text-danger fw-bold">¡Últimas {{ product.stock }}!</small>
                  </div>
                  
                  <router-link :to="`/products/${product.id}`" class="btn w-100 fw-bold" :class="product.stock <= 0 ? 'btn-secondary disabled' : 'btn-primary'">
                      {{ product.stock <= 0 ? 'Sin Stock' : 'Ver Detalles' }}
                  </router-link>
                </div>
            </div>
        </div>
      </div>
    </main>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import MainLayout from '../layouts/MainLayout.vue';
import axios from '../api/axios'; 

const products = ref([]);
const loading = ref(true);

const searchQuery = ref('');
const selectedCategory = ref('');
const sortOrder = ref('default');

// --- MEJORA 2: MEMORIA DE VISTA ---
const viewMode = ref(localStorage.getItem('viewMode') || 'grid');

watch(viewMode, (newMode) => {
  localStorage.setItem('viewMode', newMode);
});
// ----------------------------------

const uniqueCategories = computed(() => {
  const categories = products.value.map(p => p.category).filter(cat => cat != null && cat !== '');
  return [...new Set(categories)];
});

const filteredProducts = computed(() => {
  let result = [...products.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
  }
  if (selectedCategory.value) result = result.filter(p => p.category === selectedCategory.value);
  if (sortOrder.value === 'low') result.sort((a, b) => a.price - b.price);
  else if (sortOrder.value === 'high') result.sort((a, b) => b.price - a.price);
  return result;
});

const resetFilters = () => { searchQuery.value = ''; selectedCategory.value = ''; sortOrder.value = 'default'; };
const fetchProducts = async () => { try { const response = await axios.get('/api/products'); products.value = response.data; } catch (error) { console.error(error); } finally { loading.value = false; } };
const getImagePath = (img) => img ? (img.startsWith('http') ? img : `/img/${img}`) : '/img/marcaDeAgua.png';
const formatPrice = (p) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);
const truncate = (t, l) => t && t.length > l ? t.substring(0, l) + '...' : t;

onMounted(fetchProducts);
</script>

<style scoped>
.btn-primary { background: linear-gradient(90deg, #FF6B00, #ff8c42); border: none; transition: 0.2s; }
.btn-primary:hover { transform: scale(1.02); }
.tarjeta-producto { background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 15px; transition: 0.3s; position: relative; }
.tarjeta-producto:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
.overlay-agotado { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.6); z-index: 5; display: flex; align-items: center; justify-content: center; }
.badge-agotado { background: #dc3545; color: white; padding: 10px 20px; font-weight: bold; transform: rotate(-15deg); border-radius: 5px; }

.contenedor-productos { display: grid; gap: 28px; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); }
.contenedor-productos .tarjeta-producto { display: flex; flex-direction: column; align-items: center; text-align: center; }
.contenedor-productos .imagen-maqueta { width: 100%; height: 300px; object-fit: cover; border-radius: 8px; }

.contenedor-productos-lista { display: flex; flex-direction: column; gap: 20px; }
.tarjeta-lista { display: flex; flex-direction: row !important; align-items: stretch !important; text-align: left !important; padding: 20px; }
.tarjeta-lista .imagen-container { flex: 0 0 250px; margin-right: 25px; }
.tarjeta-lista .imagen-maqueta { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; }
.tarjeta-lista .info-container { align-items: flex-start !important; justify-content: center; }

@media (max-width: 768px) {
  .tarjeta-lista { flex-direction: column !important; text-align: center !important; }
  .tarjeta-lista .imagen-container { flex: auto; margin-right: 0; margin-bottom: 15px; }
  .tarjeta-lista .imagen-maqueta { height: 250px; }
  .tarjeta-lista .info-container { align-items: center !important; }
}
</style>