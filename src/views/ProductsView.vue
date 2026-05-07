<template>
  <MainLayout>
    <main class="contenido-principal" style="padding-top: 50px; min-height: 100vh;">
      
      <div class="container">
        
        <div class="row mb-5 align-items-center text-center text-md-start">
          <div class="col-md-6 mb-3 mb-md-0">
              <h1 class="display-4 fw-bold">Nuestro Catálogo</h1>
              <p class="lead text-muted mb-0">Explora todos nuestros productos e impresoras</p>
          </div>
          <div class="col-md-6">
            <div class="input-group shadow-sm">
              <span class="input-group-text bg-white border-end-0 fs-5">🔍</span>
              <input 
                type="text" 
                class="form-control border-start-0 py-2 fs-5 search-input" 
                v-model="searchQuery" 
                placeholder="Buscar (ej. coche, maqueta...)"
              >
            </div>
          </div>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="alert alert-warning text-center shadow-sm fs-5">
          No hemos encontrado ningún producto que coincida con "<strong>{{ searchQuery }}</strong>".
        </div>

        <div v-else class="contenedor-productos">
            
            <div 
              v-for="product in filteredProducts" 
              :key="product.id" 
              class="tarjeta-producto shadow-sm" 
              :class="{ 'agotado': product.stock <= 0 }"
              style="position: relative; overflow: hidden;"
            >

                <div v-if="product.stock <= 0" class="overlay-agotado">
                    <span class="badge-agotado">AGOTADO</span>
                </div>

                <img
                    :src="getImagePath(product.image)"
                    :alt="product.name"
                    @error="handleImageError"
                    class="imagen-maqueta"
                    :style="product.stock <= 0 ? 'filter: grayscale(100%); opacity: 0.5;' : ''"
                >

                <h3 class="mt-3">{{ product.name }}</h3>

                <p class="producto-descripcion text-muted">
                    {{ truncate(product.description, 100) }}
                </p>

                <div class="d-flex justify-content-between align-items-center mb-3 mt-auto" style="width: 100%; padding: 0 10px;">
                    <span class="producto-precio text-success fw-bold fs-5">
                        {{ formatPrice(product.price) }}
                    </span>
                    
                    <small v-if="product.stock > 0 && product.stock <= 5" class="text-danger fw-bold">
                        ¡Quedan {{ product.stock }}!
                    </small>
                </div>

                <router-link 
                    :to="`/product/${product.id}`" 
                    class="btn w-100 fw-bold"
                    :class="product.stock <= 0 ? 'btn-secondary disabled' : 'btn-primary'"
                    :style="{ pointerEvents: product.stock <= 0 ? 'none' : 'auto' }"
                >
                    {{ product.stock <= 0 ? 'Sin Stock' : 'Ver Detalles y Opinar' }}
                </router-link>

            </div>
        </div>
      </div>
      <br>

    </main>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MainLayout from '../layouts/MainLayout.vue';
import axios from '../api/axios'; 

const products = ref([]);
const loading = ref(true);
const searchQuery = ref('');

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  
  const query = searchQuery.value.toLowerCase();
  return products.value.filter(product => 
    product.name.toLowerCase().includes(query) || 
    (product.description && product.description.toLowerCase().includes(query))
  );
});

const fetchProducts = async () => {
  try {
    const response = await axios.get('/api/products');
    products.value = response.data;
  } catch (error) {
    console.error("Error al cargar el catálogo:", error);
  } finally {
    loading.value = false;
  }
};

const getImagePath = (imageName) => {
    if (!imageName) return '/img/marcaDeAgua.png';
    if (imageName.startsWith('http')) return imageName;
    return `/img/${imageName}`; 
};

const handleImageError = (e) => {
    e.target.src = '/img/marcaDeAgua.png';
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
};

const truncate = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
};

onMounted(() => {
    fetchProducts();
});
</script>

<style scoped>
/* --- NUEVA CLASE PARA FIJAR EL TAMAÑO DE LA IMAGEN EXACTAMENTE A 267x405 --- */
.imagen-maqueta {
  width: 100%;
  max-width: 267px;       /* Ancho máximo de 267px */
  height: 405px;          /* Alto fijo de 405px */
  object-fit: cover;      /* Recorta la imagen para que encaje sin aplastarla o deformarla */
  margin: 0 auto;         /* Centra la imagen dentro de la tarjeta */
  display: block;
  border-radius: 8px;     /* Redondea un poquito los bordes de la foto */
}

/* Estilo del input de búsqueda */
.input-group-text { background-color: transparent; }
.search-input:focus { border-color: #dee2e6; box-shadow: none; }

/* Overlay Agotado */
.overlay-agotado {
    position: absolute; 
    top: 0; left: 0; 
    width: 100%; height: 100%; 
    background: rgba(255,255,255,0.6); 
    z-index: 5; display: flex; 
    align-items: center; justify-content: center;
}

.badge-agotado {
    background: #dc3545; color: white; 
    padding: 10px 20px; font-weight: bold; 
    transform: rotate(-15deg); font-size: 1.2rem; 
    border-radius: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Botón */
.btn-primary {
    background: linear-gradient(90deg, #007BFF, #00C6FF);
    border: none; color: white; text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-primary:hover {
    transform: scale(1.02); box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
}

/* Tarjeta y Flexbox */
.tarjeta-producto {
    display: flex; flex-direction: column; align-items: center; text-align: center;
    background: #fff; border: 1px solid #eee; border-radius: 12px;
    padding: 15px; transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tarjeta-producto:hover {
    transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
}

/* Grid layout */
.contenedor-productos {
    display: grid; gap: 28px; width: 100%;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    padding-bottom: 40px;
}

@media (min-width: 576px) and (max-width: 991.98px) {
    .contenedor-productos { grid-template-columns: repeat(2, minmax(260px, 1fr)); }
}

@media (max-width: 575.98px) {
    .contenedor-productos { grid-template-columns: 1fr; padding: 0 10px; }
    .tarjeta-producto { padding: 12px; gap: 6px; border-radius: 10px; }
    .tarjeta-producto .producto-precio { font-size: 1.2rem; margin: 4px 0; }
    .tarjeta-producto .producto-descripcion { font-size: 0.85rem; min-height: auto; margin-bottom: 5px; }
    .tarjeta-producto .btn { padding: 8px 16px; font-size: 0.9rem; }
}
</style>