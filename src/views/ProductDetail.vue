<template>
  <MainLayout>
    <main class="product-detail-container" style="padding-top: 50px; min-height: 100vh;">
      <div class="container py-5">
        
        <button @click="$router.back()" class="btn btn-outline-secondary fw-bold mb-4">
          &larr; Volver al Catálogo
        </button>

        <div v-if="loading" class="row g-5 mb-5">
            <div class="col-md-6">
                <div class="skeleton-box rounded-4 w-100" style="height: 400px;"></div>
            </div>
            <div class="col-md-6 d-flex flex-column justify-content-center">
                <div class="skeleton-box mb-3" style="height: 50px; width: 70%;"></div>
                <div class="skeleton-box mb-4" style="height: 20px; width: 30%;"></div>
                <div class="skeleton-box mb-4" style="height: 100px; width: 100%;"></div>
            </div>
        </div>

        <div v-else-if="product" class="card shadow-lg border-0 mb-5 overflow-hidden product-main-card">
            <div class="row g-0">
                <div class="col-md-6 bg-white d-flex align-items-center justify-content-center p-4 position-relative product-image-wrapper">
                    <div v-if="product.stock <= 0" class="overlay-agotado-detalle">
                        <span class="badge-agotado-detalle">AGOTADO</span>
                    </div>
                    <img 
                        :src="getImagePath(product.image)" 
                        class="img-fluid rounded" 
                        :alt="product.name" 
                        @error="handleImageError"
                        style="max-height: 400px; object-fit: contain;"
                        :style="product.stock <= 0 ? 'filter: grayscale(100%); opacity: 0.5;' : ''"
                    >
                </div>
                
                <div class="col-md-6 bg-light product-info-card">
                    <div class="card-body p-5 h-100 d-flex flex-column justify-content-center">
                        <div class="d-flex justify-content-between align-items-start">
                            <h1 class="display-5 fw-bold mb-2">{{ product.name }}</h1>
                            <div class="text-end">
                                <div class="fs-4 text-warning fw-bold">{{ averageRating }} ⭐</div>
                                <small class="text-muted">{{ comments.length }} opiniones</small>
                            </div>
                        </div>
                        
                        <p class="lead mb-4 text-muted">{{ product.description }}</p>
                        
                        <div class="d-flex align-items-center gap-3 mb-4">
                            <h2 class="text-primary fw-bold mb-0 display-5">{{ formatPrice(product.price) }}</h2>
                            <span v-if="product.stock > 5" class="badge bg-success fs-6">En Stock ({{ product.stock }})</span>
                            <span v-else-if="product.stock > 0" class="badge bg-warning text-dark fs-6">¡Últimas unidades! ({{ product.stock }})</span>
                            <span v-else class="badge bg-secondary fs-6">Sin Stock</span>
                        </div>

                        <div class="d-flex flex-wrap align-items-center gap-3 mb-4 position-relative">
                            <button
                                v-if="auth.user"
                                @click="toggleLike" 
                                class="btn btn-lg rounded-pill px-4 transition-btn fw-bold"
                                :class="[isLiked ? 'btn-danger' : 'btn-outline-danger', animateLike ? 'heartbeat-animation' : '']"
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
                                class="btn btn-primary btn-lg px-4 rounded-pill shadow transition-btn fw-bold add-to-cart-btn"
                            >
                                Añadir al Carrito 🛒
                            </button>

                            <button 
                                v-if="canAddToCart" 
                                @click="handleBuyNow"
                                class="btn btn-dark btn-lg px-4 rounded-pill shadow transition-btn fw-bold"
                            >
                                Comprar Ahora ⚡
                            </button>

                            <button 
                                v-else-if="product.stock > 0 && !canAddToCart" 
                                class="btn btn-warning btn-lg px-5 rounded-pill shadow text-dark fw-bold" disabled>
                                Máx. Stock Alcanzado ⚠️
                            </button>
                            <button v-else class="btn btn-secondary btn-lg px-5 rounded-pill shadow fw-bold" disabled>🚫 AGOTADO</button>

                            <transition name="fade">
                                <span v-if="showAddedMessage" class="added-notification text-success fw-bold ms-2">✅ ¡Añadido!</span>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="product && !loading" class="row justify-content-center mb-5">
          <div class="col-lg-8">
            <h4 class="fw-bold mb-3 px-2">❓ Dudas Frecuentes sobre la Maqueta</h4>
            <div class="accordion shadow-sm rounded-4 overflow-hidden" id="faqAccordion">
              <div class="accordion-item border-0 border-bottom">
                <h2 class="accordion-header">
                  <button class="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                    ¿De qué material está fabricado?
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                  <div class="accordion-body text-muted">
                    Todas nuestras maquetas y figuras están impresas en <strong>PLA Premium o Resina de alta resolución</strong>, asegurando detalles precisos y alta durabilidad. El acabado puede tener ligeras texturas naturales del proceso de impresión 3D.
                  </div>
                </div>
              </div>
              <div class="accordion-item border-0 border-bottom">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                    ¿Cuáles son los tiempos de envío?
                  </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div class="accordion-body text-muted">
                    Si el producto tiene stock, el envío tarda entre <strong>24 y 48 horas laborables</strong>. Si solicitas un producto personalizado que debemos imprimir desde cero, el tiempo de producción y envío suele ser de 3 a 5 días.
                  </div>
                </div>
              </div>
              <div class="accordion-item border-0">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                    ¿Viene pintado como en la foto?
                  </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div class="accordion-body text-muted">
                    Sí, las fotos de nuestro catálogo corresponden al <strong>producto final real</strong>. Aquellos productos marcados como "Kit para pintar" llegarán en color gris neutro, listos para tu imprimación.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="product && !loading" class="row justify-content-center mb-5">
            <div class="col-lg-8">
                <div class="bg-white p-5 rounded-4 shadow-sm product-info-card border-top">
                    
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 border-bottom pb-3 gap-3">
                        <h3 class="fw-bold mb-0">💬 Opiniones</h3>
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm rounded-pill fw-bold" :class="starFilter === 0 ? 'btn-warning text-dark' : 'btn-outline-secondary'" @click="starFilter = 0">Todas</button>
                            <button class="btn btn-sm rounded-pill fw-bold" :class="starFilter === 5 ? 'btn-warning text-dark' : 'btn-outline-secondary'" @click="starFilter = 5">5 ⭐</button>
                            <button class="btn btn-sm rounded-pill fw-bold" :class="starFilter === 4 ? 'btn-warning text-dark' : 'btn-outline-secondary'" @click="starFilter = 4">4 ⭐</button>
                            <button class="btn btn-sm rounded-pill fw-bold" :class="starFilter === 3 ? 'btn-warning text-dark' : 'btn-outline-secondary'" @click="starFilter = 3">3 ⭐</button>
                            <button class="btn btn-sm rounded-pill fw-bold" :class="starFilter === 2 ? 'btn-warning text-dark' : 'btn-outline-secondary'" @click="starFilter = 2">2 ⭐</button>
                            <button class="btn btn-sm rounded-pill fw-bold" :class="starFilter === 1 ? 'btn-warning text-dark' : 'btn-outline-secondary'" @click="starFilter = 1">1 ⭐</button>
                        </div>
                    </div>

                    <div v-if="filteredComments.length > 0" class="mb-5">
                        <div v-for="comment in filteredComments" :key="comment.id" class="d-flex mb-4 pb-3 border-bottom position-relative">
                            <div class="flex-shrink-0">
                                <div class="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 45px; height: 45px; font-weight:bold;">
                                    {{ comment.user.name.charAt(0).toUpperCase() }}
                                </div>
                            </div>
                            <div class="ms-3 w-100">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h6 class="mb-0 fw-bold">{{ comment.user.name }} {{ comment.user.surname || '' }}</h6>
                                    <small class="text-muted">{{ new Date(comment.created_at).toLocaleDateString() }}</small>
                                </div>
                                <div class="text-warning small mb-1">{{ '⭐'.repeat(comment.rating) }}</div>
                                <p class="mb-1 text-secondary">{{ comment.text }}</p>

                                <div v-if="auth.user && (auth.user.id === comment.user_id || auth.user.role === 'admin')" class="mt-2">
                                    <button @click="deleteComment(comment.id)" class="btn btn-sm btn-link text-danger p-0 text-decoration-none">🗑️ Borrar</button>                                
                                </div>
                            </div>
                        </div>
                    </div>
                    <p v-else class="text-center text-muted mb-5 fs-5">No hay opiniones disponibles para este filtro.</p>

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
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import axios from '../api/axios';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const route = useRoute();
const router = useRouter(); 
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

// --- LÓGICA DE FILTRO DE ESTRELLAS ---
const starFilter = ref(0);
const filteredComments = computed(() => {
    if (starFilter.value === 0) return comments.value;
    return comments.value.filter(c => parseInt(c.rating) === starFilter.value);
});

const canAddToCart = computed(() => {
    if (!product.value || product.value.stock <= 0) return false;
    const itemInCart = cartStore.cart.find(item => item.id === product.value.id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    return (quantityInCart + 1) <= product.value.stock;
});

// --- LÓGICA DE COMPRAR AHORA ---
const handleBuyNow = () => {
    if (canAddToCart.value) {
        cartStore.addToCart(product.value);
        router.push('/checkout');
    }
};

const checkLikeStatus = async (id) => {
    try {
        const likeRes = await axios.get(`/api/products/${id}/like`);
        isLiked.value = likeRes.data.is_liked;
        if (likeRes.data.likes_count !== undefined) likesCount.value = likeRes.data.likes_count;
    } catch (e) { console.error("Error comprobando likes:", e); }
};

const loadProductData = async (id) => {
    loading.value = true;
    try {
        const [prodRes, commRes] = await Promise.all([
            axios.get(`/api/products/${id}`),
            axios.get(`/api/products/${id}/comments`)
        ]);
        
        product.value = prodRes.data;
        comments.value = commRes.data;
        likesCount.value = prodRes.data.likes_count || 0;

        if (product.value) {
          let viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
          viewed = viewed.filter(p => p.id !== product.value.id);
          viewed.unshift({
            id: product.value.id, name: product.value.name, image: product.value.image,
            price: product.value.price, description: product.value.description, stock: product.value.stock
          });
          if (viewed.length > 4) viewed.pop();
          localStorage.setItem('recently_viewed', JSON.stringify(viewed));
        }

        if (auth.user) await checkLikeStatus(id);

    } catch (error) { console.error("Error:", error); } 
    finally { loading.value = false; }
};

onMounted(() => {
    loadProductData(route.params.id);
});

watch(() => auth.user, (newUser) => { if (newUser && product.value) checkLikeStatus(product.value.id); });
watch(() => route.params.id, (newId) => { if (newId) loadProductData(newId); });

// --- LÓGICA ANIMACIÓN LIKE ---
const animateLike = ref(false);
const toggleLike = async () => {
    if (!auth.user) return alert("Debes iniciar sesión.");
    try {
        const res = await axios.post(`/api/products/${product.value.id}/like`);
        isLiked.value = res.data.status === 'liked';
        likesCount.value = res.data.likes_count;
        
        if(isLiked.value) {
            animateLike.value = true;
            setTimeout(() => animateLike.value = false, 600);
        }
    } catch (e) { console.error(e); }
};

const submitComment = async () => {
    try {
        await axios.post(`/api/products/${product.value.id}/comments`, newComment.value);
        const res = await axios.get(`/api/products/${product.value.id}/comments`);
        comments.value = res.data;
        newComment.value.text = ''; newComment.value.rating = 5;
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
    return `/img/${img}`;
};
const handleImageError = (e) => e.target.src = '/img/marcaDeAgua.png';
const formatPrice = (p) => {
    if (p === undefined || p === null) return '0,00 €';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);
};
</script>

<style scoped>
.btn-primary { background: linear-gradient(90deg, #FF6B00, #ff8c42); border: none; }
.btn-primary:hover { background: linear-gradient(90deg, #ff8c42, #FF6B00); }
.overlay-agotado-detalle { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.7); z-index: 10; display: flex; align-items: center; justify-content: center; }
.badge-agotado-detalle { background: #dc3545; color: white; padding: 20px 40px; font-weight: bold; transform: rotate(-15deg); font-size: 2rem; border: 4px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
.transition-btn { transition: transform 0.2s; }
.transition-btn:active { transform: scale(0.95); }

/* ANIMACIÓN LATIDO LIKE */
@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1); }
  75% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.heartbeat-animation { animation: heartbeat 0.6s ease-in-out; }

/* EFECTO SKELETON LOADING */
.skeleton-box {
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}
@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>

<style>
/* SOPORTE MODO OSCURO PARA SKELETON Y FAQ ACORDEÓN */
[data-bs-theme="dark"] .skeleton-box { background: linear-gradient(90deg, #2c2c2c 25%, #3a3a3a 50%, #2c2c2c 75%); background-size: 200% 100%; }

[data-bs-theme="dark"] .accordion-button { background-color: #242424 !important; color: #f8f9fa !important; }
[data-bs-theme="dark"] .accordion-button:not(.collapsed) { background-color: #1a1a1a !important; color: #FF6B00 !important; }
[data-bs-theme="dark"] .accordion-item { background-color: #242424 !important; border-color: #383838 !important; }
[data-bs-theme="dark"] .accordion-body { color: #ccc !important; }
</style>