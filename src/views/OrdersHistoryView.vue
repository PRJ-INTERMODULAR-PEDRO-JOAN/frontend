<template>
  <div class="container mt-5 mb-5">
    <div class="mb-4">
      <router-link to="/" class="btn-volver-pedidos">
        <span class="me-2 fs-5">🏠</span> Volver al Inicio
      </router-link>
    </div>

    <h2 class="mb-4">Mis Pedidos 📦</h2>
    
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="alert alert-info shadow-sm">
      No has realizado ningún pedido todavía. ¡Explora nuestra tienda!
    </div>

    <div v-else>
      <div class="card mb-4 shadow-sm" v-for="order in orders" :key="order.id">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <span><strong>Pedido #{{ order.id }}</strong></span>
          <span>{{ new Date(order.created_at).toLocaleDateString() }}</span>
        </div>
        <div class="card-body">
          <h5 class="card-title text-primary">Total Pagado: {{ order.total_price }} €</h5>
          <p class="card-text">
            Estado: <span class="badge bg-success">{{ order.status || 'Completado' }}</span>
          </p>
          <hr>
          <h6 class="text-muted">Artículos del pedido:</h6>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center" v-for="item in order.items" :key="item.id">
              <div>
                <strong>{{ item.product ? item.product.name : 'Producto no disponible' }}</strong>
                <span class="text-muted ms-2">(Cantidad: {{ item.quantity }})</span>
              </div>
              <span class="fw-bold">{{ item.price }} €</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/axios';

export default {
  name: 'OrdersHistoryView',
  data() {
    return {
      orders: [],
      loading: true
    };
  },
  async created() {
    try {
      // AÑADIMOS /api/ AQUÍ
      const response = await api.get('/api/user/orders');
      // Extracción segura de datos
      this.orders = Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
      console.error('Error cargando el historial de pedidos:', error);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
/* Estilo único para este botón sin afectar a nada más */
.btn-volver-pedidos {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: linear-gradient(90deg, #FF6B00, #ff8c42);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-volver-pedidos:hover {
  transform: scale(1.05);
  color: white;
  box-shadow: 0 4px 10px rgba(255, 107, 0, 0.3);
}
</style>