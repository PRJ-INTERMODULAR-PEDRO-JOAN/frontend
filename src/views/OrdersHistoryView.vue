<template>
  <MainLayout>
    <div class="orders-container py-5" style="min-height: 100vh;">
      <div class="container">
        
        <div class="d-flex justify-content-between align-items-end mb-5">
            <div>
                <h1 class="display-5 fw-bold mb-0 texto-titulo">Mis Pedidos</h1>
                <p class="text-muted lead mb-0">Revisa el estado de tus compras</p>
            </div>
            <router-link to="/dashboard" class="btn btn-outline-secondary fw-bold rounded-pill">Volver al Perfil</router-link>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-5 empty-state-card shadow-sm rounded-4 bg-white border">
            <div class="mb-4" style="font-size: 5rem;">📦</div>
            <h3 class="fw-bold texto-titulo mb-3">Aún no tienes pedidos</h3>
            <p class="text-muted fs-5 mb-4">¡Explora nuestro catálogo y empieza a crear tu colección de maquetas 3D!</p>
            <router-link to="/products" class="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow">
                Ver Catálogo
            </router-link>
        </div>

        <div v-else>
          <div v-for="order in orders" :key="order.id" class="card order-card shadow-sm border-0 rounded-4 mb-4">
            <div class="card-header bg-light border-bottom-0 p-4 d-flex justify-content-between align-items-center rounded-top-4">
              <div>
                <h5 class="fw-bold mb-1 texto-titulo">Pedido #{{ order.id }}</h5>
                <small class="text-muted">{{ new Date(order.created_at).toLocaleDateString() }}</small>
              </div>
              <div class="text-end">
                <span class="fs-5 fw-bold text-success">{{ formatPrice(order.total_price) }}</span>
              </div>
            </div>
            
            <div class="card-body p-4">
              <div class="order-timeline my-4 position-relative">
                <div class="progress position-absolute top-50 start-0 w-100 translate-middle-y" style="height: 4px; z-index: 1;">
                  <div class="progress-bar bg-success transition-all" :style="{ width: getProgressWidth(order.status) }"></div>
                </div>
                
                <div class="d-flex justify-content-between position-relative z-2">
                  <div class="timeline-step text-center" :class="{ 'active': getStepLevel(order.status) >= 1 }">
                    <div class="icon-circle shadow-sm">📦</div>
                    <small class="fw-bold mt-2 d-block">Preparando</small>
                  </div>
                  <div class="timeline-step text-center" :class="{ 'active': getStepLevel(order.status) >= 2 }">
                    <div class="icon-circle shadow-sm">🚚</div>
                    <small class="fw-bold mt-2 d-block">Enviado</small>
                  </div>
                  <div class="timeline-step text-center" :class="{ 'active': getStepLevel(order.status) >= 3 }">
                    <div class="icon-circle shadow-sm">✅</div>
                    <small class="fw-bold mt-2 d-block">Entregado</small>
                  </div>
                </div>
              </div>

              <h6 class="fw-bold mt-4 mb-3 texto-titulo border-top pt-4">Artículos comprados:</h6>
              <ul class="list-group list-group-flush">
                <li v-for="item in order.items" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-bottom border-light">
                  <div class="d-flex align-items-center gap-3">
                    <img :src="getImagePath(item.product?.image)" class="rounded shadow-sm" style="width: 50px; height: 50px; object-fit: cover;">
                    <div>
                      <span class="fw-bold texto-titulo d-block">{{ item.product?.name || 'Producto Desconocido' }}</span>
                      <small class="text-muted">Cantidad: {{ item.quantity }}</small>
                    </div>
                  </div>
                  <span class="fw-bold text-success">{{ formatPrice(item.price * item.quantity) }}</span>
                </li>
              </ul>
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
import axios from '../api/axios';

const orders = ref([]);
const loading = ref(true);

const getStepLevel = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'entregado') return 3;
  if (s === 'enviado') return 2;
  return 1;
};

const getProgressWidth = (status) => {
  const level = getStepLevel(status);
  if (level === 1) return '0%';
  if (level === 2) return '50%';
  return '100%';
};

// LÓGICA DE CARGA ORIGINAL RESTAURADA
const fetchOrders = async () => {
  try {
    const response = await axios.get('/api/user/orders');
    orders.value = Array.isArray(response.data) ? response.data : response.data.data || [];
  } catch (e) {
    console.error('Error cargando el historial de pedidos:', e);
  } finally {
    loading.value = false;
  }
};

const getImagePath = (img) => img ? (img.startsWith('http') ? img : `/img/${img}`) : '/img/marcaDeAgua.png';
const formatPrice = (p) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);

onMounted(fetchOrders);
</script>

<style scoped>
.orders-container { background-color: #f8f9fa; }
.btn-primary { background: linear-gradient(90deg, #FF6B00, #ff8c42); border: none; }
.btn-primary:hover { transform: scale(1.02); }
.order-timeline { padding: 0 20px; }
.timeline-step { opacity: 0.4; transition: all 0.3s; }
.timeline-step.active { opacity: 1; }
.icon-circle { width: 45px; height: 45px; background: #fff; border: 2px solid #ddd; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin: 0 auto; background-color: white; transition: 0.3s; }
.timeline-step.active .icon-circle { border-color: #28a745; background-color: #d1e7dd; }
.transition-all { transition: width 0.5s ease-in-out; }
.empty-state-card { padding: 80px 20px; }
</style>

<style>
/* Soporte Modo Oscuro Global */
[data-bs-theme="dark"] .orders-container { background-color: #121212 !important; }
[data-bs-theme="dark"] .empty-state-card { background-color: #242424 !important; border-color: #383838 !important; }
[data-bs-theme="dark"] .order-card { background-color: #242424 !important; border: 1px solid #383838 !important; }
[data-bs-theme="dark"] .order-card .card-header { background-color: #1a1a1a !important; border-bottom: 1px solid #383838 !important; }
[data-bs-theme="dark"] .texto-titulo { color: #f8f9fa !important; }
[data-bs-theme="dark"] .list-group-item { color: #f8f9fa !important; border-color: #383838 !important; }
[data-bs-theme="dark"] .icon-circle { background-color: #1a1a1a !important; border-color: #444 !important; }
[data-bs-theme="dark"] .timeline-step.active .icon-circle { border-color: #28a745 !important; background-color: #0f5132 !important; }
</style>