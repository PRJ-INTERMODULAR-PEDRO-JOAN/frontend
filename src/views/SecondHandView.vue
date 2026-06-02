<template>
  <div class="container my-5">
    
    <div class="mb-4">
      <router-link to="/" class="btn btn-outline-secondary shadow-sm rounded-pill px-4">
        &larr; Volver al inicio
      </router-link>
    </div>
    <div class="text-center mb-5">
      <h1 class="display-4 fw-bold">Mercado de Segunda Mano</h1>
      <p class="lead text-muted">Encuentra los mejores productos reacondicionados y usados con descuentos increíbles.</p>
    </div>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="products.length === 0" class="alert alert-info text-center shadow-sm">
      <i class="bi bi-info-circle me-2"></i> Actualmente no hay productos de segunda mano disponibles. ¡Vuelve pronto!
    </div>

    <div v-else class="row g-4">
      <div v-for="product in products" :key="product.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm border-0">
          <div class="position-absolute top-0 end-0 p-2">
            <span class="badge bg-warning text-dark shadow-sm">2ª Mano</span>
          </div>
          
          <img :src="product.image || 'https://via.placeholder.com/300x200?text=Sin+Imagen'" class="card-img-top" :alt="product.name" style="object-fit: cover; height: 200px;">
          
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-truncate" :title="product.name">{{ product.name }}</h5>
            <p class="card-text text-muted small" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              {{ product.description }}
            </p>
            
            <div class="mt-auto">
              <h4 class="text-primary fw-bold mb-3">{{ product.price }} €</h4>
              <router-link :to="`/products/${product.id}`" class="btn btn-outline-primary w-100">
                Ver Detalles
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Estado
const products = ref([]);
const loading = ref(true);

// Función para obtener datos
const fetchSecondHandProducts = async () => {
  try {
    // IMPORTANTE: Ajusta esta URL según cómo tengas configurado tu axios (por ejemplo, si usas una instancia base)
    // Si usas api/axios.js, podrías importarlo: import api from '@/api/axios.js' y hacer api.get(...)
    const response = await axios.get('http://localhost/api/products/second-hand');
    products.value = response.data;
  } catch (error) {
    console.error('Error al cargar los productos de segunda mano:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSecondHandProducts();
});
</script>

<style scoped>
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
</style>