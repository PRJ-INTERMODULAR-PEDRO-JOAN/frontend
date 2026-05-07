<template>
  <MainLayout>
    <div class="wishlist-container py-5" style="min-height: 100vh;">
      <div class="container">
        
        <div class="d-flex justify-content-between align-items-end mb-5">
            <div>
                <h1 class="display-5 fw-bold mb-0 texto-titulo">Mis Favoritos ❤️</h1>
                <p class="text-muted lead mb-0">Tus maquetas deseadas en un solo lugar</p>
            </div>
            <router-link to="/products" class="btn btn-primary fw-bold rounded-pill shadow">Seguir Comprando</router-link>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="products.length === 0" class="text-center py-5 empty-state-card shadow-sm rounded-4 bg-white border">
            <div class="mb-4 heart-pulse" style="font-size: 5rem;">💖</div>
            <h3 class="fw-bold texto-titulo mb-3">Tu lista está vacía</h3>
            <p class="text-muted fs-5 mb-4">¿Aún no te has enamorado de ninguna maqueta?</p>
            <router-link to="/products" class="btn btn-outline-danger btn-lg rounded-pill px-5 fw-bold shadow-sm">Explorar Catálogo</router-link>
        </div>

        <div v-else class="row g-4">
          <div v-for="product in products" :key="product.id" class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden wishlist-card">
              <div class="position-relative">
                <img :src="getImagePath(product.image)" class="card-img-top w-100" style="height: 250px; object-fit: cover;">
                
                <button @click="removeFromWishlist(product.id)" class="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle shadow fw-bold border-0 text-danger hover-zoom" title="Eliminar de favoritos">
                  ❌
                </button>
              </div>
              <div class="card-body p-4 bg-light">
                <span class="badge bg-secondary mb-2">{{ product.category || 'Maqueta' }}</span>
                <h5 class="fw-bold mb-2 texto-titulo text-truncate">{{ product.name }}</h5>
                <p class="text-success fw-bold fs-4 mb-4">{{ formatPrice(product.price) }}</p>
                
                <div class="d-grid gap-2 mt-auto">
                  <router-link :to="`/products/${product.id}`" class="btn btn-dark rounded-pill fw-bold">Ver Detalles</router-link>
                  <button @click="addToCart(product)" class="btn btn-primary rounded-pill fw-bold shadow-sm">Añadir al Carrito 🛒</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MainLayout from '../layouts/MainLayout.vue';
import { useCartStore } from '@/stores/cart';
import axios from '../api/axios';

const products = ref([]);
const loading = ref(true);
const cartStore = useCartStore();

// LÓGICA DE CARGA ORIGINAL RESTAURADA
const fetchWishlist = async () => {
  try {
    const response = await axios.get('/api/user/wishlist');
    products.value = Array.isArray(response.data) ? response.data : response.data.data || [];
  } catch (e) {
    console.error('Error cargando la lista de deseos:', e);
  } finally {
    loading.value = false;
  }
};

const removeFromWishlist = async (id) => {
    try {
        await axios.post(`/api/products/${id}/like`); // En tu backend, post a like borra el like si ya lo tenía
        products.value = products.value.filter(p => p.id !== id);
    } catch (e) {
        console.error("Error al eliminar", e);
    }
};

const addToCart = (p) => {
  cartStore.addToCart(p);
  // Pequeño feedback
  const offcanvas = new bootstrap.Offcanvas(document.getElementById('miniCart'));
  if (offcanvas) offcanvas.show();
};

const getImagePath = (img) => img ? (img.startsWith('http') ? img : `/img/${img}`) : '/img/marcaDeAgua.png';
const formatPrice = (p) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);

onMounted(fetchWishlist);
</script>

<style scoped>
.wishlist-container { background-color: #f8f9fa; }
.wishlist-card { transition: 0.3s; background-color: #fff; }
.wishlist-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
.btn-primary { background: linear-gradient(90deg, #FF6B00, #ff8c42); border: none; }
.btn-primary:hover { transform: scale(1.02); }
.hover-zoom { transition: 0.2s; }
.hover-zoom:hover { transform: scale(1.15); }
.empty-state-card { padding: 80px 20px; }

/* Animación del corazón */
.heart-pulse { animation: pulse 1.5s infinite; }
@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
</style>

<style>
/* Soporte Modo Oscuro Global */
[data-bs-theme="dark"] .wishlist-container { background-color: #121212 !important; }
[data-bs-theme="dark"] .empty-state-card { background-color: #242424 !important; border-color: #383838 !important; }
[data-bs-theme="dark"] .texto-titulo { color: #f8f9fa !important; }
[data-bs-theme="dark"] .wishlist-card { background-color: #242424 !important; border: 1px solid #383838 !important; }
[data-bs-theme="dark"] .wishlist-card .bg-light { background-color: #1a1a1a !important; }
[data-bs-theme="dark"] .btn-light { background-color: #242424 !important; color: #fff !important; border: 1px solid #444 !important;}
</style>