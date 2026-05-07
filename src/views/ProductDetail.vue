<template>
  <MainLayout>
    <main class="product-detail-container" v-if="product" style="padding-top: 50px; min-height: 100vh;">
      <div class="container py-5">
        
        <button @click="$router.back()" class="btn btn-outline-secondary fw-bold mb-4">
          &larr; Volver al Catálogo
        </button>

        <div class="row g-5 mb-5">
          <div class="col-md-6">
            <div class="product-image-wrapper shadow-sm rounded-4 overflow-hidden bg-white text-center position-relative h-100 d-flex align-items-center justify-content-center p-4">
              <div v-if="product.stock <= 0" class="overlay-agotado-detalle">
                <span class="badge-agotado-detalle">AGOTADO</span>
              </div>
              <img 
                :src="getImagePath(product.image)" 
                :alt="product.name" 
                @error="handleImageError"
                class="img-fluid rounded"
                style="max-height: 500px; object-fit: contain;"
                :style="product.stock <= 0 ? 'filter: grayscale(100%); opacity: 0.5;' : ''"
              >
            </div>
          </div>

          <div class="col-md-6">
            <div class="product-info-card p-4 p-md-5 rounded-4 shadow-sm bg-white h-100 d-flex flex-column justify-content-center">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h1 class="display-5 fw-bold mb-0">{{ product.name }}</h1>
                <div class="text-end">
                  <div class="fs-4 text-warning fw-bold">{{ averageRating }} ⭐</div>
                  <small class="text-muted">{{ comments.length }} opiniones</small>
                </div>
              </div>
              
              <p class="text-muted fs-5 mb-4">{{ product.category || 'Maqueta 3D' }}</p>
              
              <p class="lead text-secondary mb-5">
                {{ product.description || 'Sin descripción disponible para este producto.' }}
              </p>

              <div class="d-flex align-items-center gap-3 mb-4">
                <h2 class="text-primary fw-bold mb-0 display-5">{{ formatPrice(product.price) }}</h2>
                <span v-if="product.stock > 5" class="badge bg-success fs-6">En Stock ({{ product.stock }})</span>
                <span v-else-if="product.stock > 0" class="badge bg-warning text-dark fs-6">¡Últimas unidades! ({{ product.stock }})</span>
                <span v-else class="badge bg-secondary fs-6">Sin Stock</span>
              </div>

              <div class="d-flex flex-wrap align-items-center gap-3">
                <button
                  v-if="auth.user"
                  @click="toggleLike" 
                  class="btn btn-lg rounded-pill px-4 transition-btn fw-bold"
                  :class="isLiked ? 'btn-danger' : 'btn-outline-danger'"
                >
                  <span v-if="isLiked">❤️</span><span v-else>🤍</span> 
                  {{ likesCount }} Likes
                </button>
                <button v-else class="btn btn-lg rounded-pill px-4 transition-btn btn-danger fw-bold" @click="$router.push('/login')">
                  Login para Likes
                </button>

                <button 
                  v-if="canAddToCart" 
                  @click="handleAddToCart"
                  class="btn btn-primary btn-lg px-5 rounded-pill shadow transition-btn fw-bold"
                >
                  Añadir al Carrito 🛒
                </button>
                <button 
                  v-else-if="product.stock > 0 && !canAddToCart" 
                  class="btn btn-warning btn-lg px-5 rounded-pill shadow text-dark fw-bold" 
                  disabled
                  title="No puedes añadir más unidades de las que hay disponibles"
                >
                  Máx. Stock Alcanzado ⚠️
                </button>
                <button v-else class="btn btn-secondary btn-lg px-5 rounded-pill shadow fw-bold" disabled>
                  🚫 AGOTADO
                </button>

                <transition name="fade">
                  <span v-if="showAddedMessage" class="added-notification text-success fw-bold ms-2">
                    ✅ ¡Añadido!
                  </span>
                </transition>

                <router-link 
                  v-if="auth.user && auth.user.role === 'admin'"
                  :to="`/products/${product.id}/edit`" 
                  class="btn btn-warning btn-lg rounded-pill shadow fw-bold border border-dark"
                >
                  ✏️ Editar
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center mb-5 border-top pt-5">
          <div class="col-lg-8">
            <div class="bg-white p-4 p-md-5 rounded-4 shadow-sm">
              <h3 class="fw-bold border-bottom pb-3 mb-4">💬 Opiniones</h3>

              <div v-if="comments.length > 0" class="mb-5">
                <div v-for="comment in comments" :key="comment.id" class="d-flex mb-4 pb-3 border-bottom position-relative">
                  <div class="flex-shrink-0">
                    <div class="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 45px; height: 45px; font-weight:bold;">
                      {{ comment.user.name.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="ms-3 w-100">
                    <div class="d-flex justify-content-between align-items-center">
                      <h6 class="mb-0 fw-bold">
                        {{ comment.user.name }} {{ comment.user.surname }}
                        <span v-if="comment.user.role === 'admin'" class="badge bg-danger ms-1" style="font-size: 0.6em;">ADMIN</span>
                      </h6>
                      <small class="text-muted">{{ new Date(comment.created_at).toLocaleDateString() }}</small>
                    </div>
                    <div class="text-warning small mb-1">{{ '⭐'.repeat(comment.rating) }}</div>
                    <p class="mb-1 text-secondary">{{ comment.text }}</p>

                    <div v-if="auth.user && (auth.user.id === comment.user_id || auth.user.role === 'admin')" class="mt-2">
                      <button @click="deleteComment(comment.id)" class="btn btn-sm btn-link text-danger p-0 text-decoration-none fw-bold">🗑️ Borrar</button>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-center text-muted mb-5 fs-5">Aún no hay comentarios.</p>

              <div v-if="auth.user" class="card bg-light border-0 p-4 rounded-3">
                <h5 class="fw-bold mb-3">✍️ Deja tu valoración</h5>
                <form @submit.prevent="submitComment">
                  <select v-model="newComment.rating" class="form-select w-auto mb-3" required>
                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                    <option value="4">⭐⭐⭐⭐ (4)</option>
                    <option value="3">⭐⭐⭐ (3)</option>
                    <option value="2">⭐⭐ (2)</option>
                    <option value="1">⭐ (1)</option>
                  </select>
                  <textarea v-model="newComment.text" class="form-control mb-3" rows="3" required placeholder="Escribe tu opinión..."></textarea>
                  <button type="submit" class="btn btn-dark fw-bold px-4">PUBLICAR</button>
                </form>
              </div>
              <div v-else class="alert alert-info text-center border-0 shadow-sm fs-5">
                <router-link to="/login" class="fw-bold text-decoration-none">Inicia sesión</router-link> para opinar.
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <div v-else-if="loading" class="text-center py-5 my-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import axios from '../api/axios';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const route = useRoute();
const auth = useAuthStore();
const cartStore = useCartStore();

const product = ref(null);
const comments = ref([]);
const loading = ref(true);
const isLiked = ref(false);
const likesCount = ref(0);
const showAddedMessage = ref(false);

const newComment = ref({ rating: 5, text: '' });

const averageRating = computed(() => {
    if (!comments.value.length) return 0;
    const sum = comments.value.reduce((acc, c) => acc + parseInt(c.rating), 0);
    return (sum / comments.value.length).toFixed(1);
});

// --- LÓGICA DE STOCK VS CARRITO ---
const canAddToCart = computed(() => {
    if (!product.value) return false;
    if (product.value.stock <= 0) return false;
    const itemInCart = cartStore.cart.find(item => item.id === product.value.id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    return (quantityInCart + 1) <= product.value.stock;
});

const loadProductData = async (id) => {
    loading.value = true;
    try {
        const [prodRes, commRes] = await Promise.all([
            axios.get(`/api/products/${id}`),
            axios.get(`/api/products/${id}/comments`)
        ]);
        
        product.value = prodRes.data;
        comments.value = commRes.data;

        // --- LÓGICA DE VISTOS RECIENTEMENTE MANTENIDA ---
        if (product.value) {
          let viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
          viewed = viewed.filter(p => p.id !== product.value.id);
          viewed.unshift({
            id: product.value.id,
            name: product.value.name,
            image: product.value.image,
            price: product.value.price,
            description: product.value.description,
            stock: product.value.stock
          });
          if (viewed.length > 4) viewed.pop();
          localStorage.setItem('recently_viewed', JSON.stringify(viewed));
        }

        if (auth.user) {
            try {
                const likeRes = await axios.get(`/api/products/${id}/like`);
                isLiked.value = likeRes.data.is_liked;
                likesCount.value = likeRes.data.likes_count;
            } catch (e) {}
        } else {
            likesCount.value = prodRes.data.likes_count || 0;
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadProductData(route.params.id);
});

watch(() => route.params.id, (newId) => {
    if (newId) loadProductData(newId);
});

const toggleLike = async () => {
    if (!auth.user) return alert("Debes iniciar sesión.");
    try {
        const res = await axios.post(`/api/products/${product.value.id}/like`);
        isLiked.value = res.data.status === 'liked';
        likesCount.value = res.data.likes_count;
    } catch (e) { console.error(e); }
};

const submitComment = async () => {
    try {
        await axios.post(`/api/products/${product.value.id}/comments`, newComment.value);
        const res = await axios.get(`/api/products/${product.value.id}/comments`);
        comments.value = res.data;
        newComment.value.text = '';
        newComment.value.rating = 5;
    } catch (e) { alert("Error al publicar."); }
};

const deleteComment = async (id) => {
    if(!confirm("¿Borrar?")) return;
    try {
        await axios.delete(`/api/comments/${id}`);
        const res = await axios.get(`/api/products/${product.value.id}/comments`);
        comments.value = res.data;
    } catch (e) { alert("Error al borrar."); }
};

const handleAddToCart = () => {
    if (canAddToCart.value) {
        cartStore.addToCart(product.value);
        showAddedMessage.value = true;
        setTimeout(() => { showAddedMessage.value = false; }, 2000);
    }
};

const getImagePath = (img) => {
    if (!img) return '/img/marcaDeAgua.png';
    if (img.startsWith('http')) return img;
    return `http://localhost/img/${img}`;
};

const handleImageError = (e) => e.target.src = '/img/marcaDeAgua.png';

const formatPrice = (p) => {
    if (p === undefined || p === null) return '0,00 €';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);
};
</script>

<style scoped>
.product-detail-container {
    background-color: #f8f9fa;
}
.btn-primary {
    background: linear-gradient(90deg, #FF6B00, #ff8c42);
    border: none;
}
.btn-primary:hover {
    background: linear-gradient(90deg, #ff8c42, #FF6B00);
}
.overlay-agotado-detalle {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(255,255,255,0.7); z-index: 10;
    display: flex; align-items: center; justify-content: center;
}
.badge-agotado-detalle {
    background: #dc3545; color: white; padding: 20px 40px; font-weight: bold;
    transform: rotate(-15deg); font-size: 2rem; border: 4px solid white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
.transition-btn { transition: transform 0.2s; }
.transition-btn:active { transform: scale(0.95); }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.added-notification {
    background-color: #d1e7dd;
    color: #0f5132;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
</style>