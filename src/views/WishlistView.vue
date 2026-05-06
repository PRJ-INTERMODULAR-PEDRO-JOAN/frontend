<template>
  <div class="container mt-5 mb-5">
    <div class="mb-4">
      <router-link to="/" class="btn-volver-deseos">
        <span class="me-2 fs-5">🏠</span> Volver al Inicio
      </router-link>
    </div>

    <h2 class="mb-4">Mi Lista de Deseos ❤️</h2>
    
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="products.length === 0" class="alert alert-secondary shadow-sm">
      Aún no tienes productos en tu lista de deseos. Dale "Me gusta" a los que te interesen.
    </div>

    <div v-else class="row g-4">
      <div class="col-md-4 col-sm-6" v-for="product in products" :key="product.id">
        <div class="card h-100 shadow-sm border-0 bg-light">
          <img v-if="product.image_url" :src="product.image_url" class="card-img-top" :alt="product.name" style="object-fit: cover; height: 200px;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text text-success fw-bold fs-5 mb-4">{{ product.price }} €</p>
            <div class="mt-auto">
              <router-link :to="`/product/${product.id}`" class="btn btn-outline-danger w-100 fw-bold">
                Ver Detalles
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/axios';

export default {
  name: 'WishlistView',
  data() {
    return {
      products: [],
      loading: true
    };
  },
  async created() {
    try {
      // AÑADIMOS /api/ AQUÍ
      const response = await api.get('/api/user/wishlist');
      // Extracción segura de datos
      this.products = Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
      console.error('Error cargando la lista de deseos:', error);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
/* Estilo único para este botón en tono azul */
.btn-volver-deseos {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: linear-gradient(90deg, #007BFF, #00C6FF);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-volver-deseos:hover {
  transform: scale(1.05);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
}
</style>