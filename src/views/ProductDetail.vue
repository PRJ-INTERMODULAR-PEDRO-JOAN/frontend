<template>
  <MainLayout>
    <main class="product-detail-container" style="padding-top: 50px; min-height: 100vh;">
      <div class="container py-5">
        
        <button @click="$router.back()" class="btn btn-outline-secondary fw-bold mb-4">
          &larr; Volver al Catálogo
        </button>

        <div v-if="loading" class="row g-5 mb-5">
            <div class="col-md-6"><div class="skeleton-box rounded-4 w-100" style="height: 400px;"></div></div>
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
                        loading="lazy"
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
                        
                        <p class="lead mb-3 text-muted">{{ product.description }}</p>
                        
                        <div class="w-100 mb-4">
                            <div class="d-flex align-items-center gap-3 mb-2">
                                <h2 class="text-primary fw-bold mb-0 display-4">{{ formatPrice(product.price) }}</h2>
                                <span v-if="product.stock > 5" class="badge bg-success fs-6 align-self-center">En Stock ({{ product.stock }})</span>
                                <span v-else-if="product.stock === 0" class="badge bg-secondary fs-6 align-self-center">Sin Stock</span>
                            </div>

                            <div v-if="product.stock > 0 && product.stock <= 5" class="scarcity-bar-container p-3 rounded-3 bg-white border border-danger border-opacity-25 shadow-sm mt-3">
                                <div class="d-flex justify-content-between align-items-end mb-2">
                                    <span class="text-danger fw-bold"><span class="fire-anim d-inline-block">🔥</span> ¡Atención! Se agota rápido</span>
                                    <span class="badge bg-danger">Solo quedan {{ product.stock }} ud.</span>
                                </div>
                                <div class="progress" style="height: 8px;">
                                    <div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" :style="{ width: (product.stock / 5 * 100) + '%' }"></div>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex flex-wrap align-items-center gap-3 mb-2 position-relative">
                            <button v-if="auth.user" @click="toggleLike" class="btn btn-lg rounded-pill px-4 transition-btn fw-bold" :class="[isLiked ? 'btn-danger' : 'btn-outline-danger', animateLike ? 'heartbeat-animation' : '']">
                                <span v-if="isLiked">❤️</span><span v-else>🤍</span> {{ likesCount }} Likes
                            </button>
                            <button v-else class="btn btn-lg rounded-pill px-4 transition-btn btn-danger fw-bold" @click="$router.push('/login')">Login para Likes</button>

                            <button v-if="canAddToCart" @click="handleAddToCart" class="btn btn-primary btn-lg px-4 rounded-pill shadow transition-btn fw-bold add-to-cart-btn">Añadir al Carrito 🛒</button>
                            <button v-if="canAddToCart" @click="handleBuyNow" class="btn btn-dark btn-lg px-4 rounded-pill shadow transition-btn fw-bold">Comprar Ahora ⚡</button>

                            <button v-else-if="product.stock > 0 && !canAddToCart" class="btn btn-warning btn-lg px-5 rounded-pill shadow text-dark fw-bold" disabled>Máx. Stock ⚠️</button>
                            <button v-else class="btn btn-secondary btn-lg px-5 rounded-pill shadow fw-bold" disabled>🚫 AGOTADO</button>

                            <transition name="fade"><span v-if="showAddedMessage" class="added-notification text-success fw-bold ms-2">✅ ¡Añadido!</span></transition>
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
                <h2 class="accordion-header"><button class="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">¿De qué material está fabricado?</button></h2>
                <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion"><div class="accordion-body text-muted">Todas nuestras maquetas y figuras están impresas en <strong>PLA Premium o Resina de alta resolución</strong>, asegurando detalles precisos y alta durabilidad.</div></div>
              </div>
              <div class="accordion-item border-0 border-bottom">
                <h2 class="accordion-header"><button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">¿Cuáles son los tiempos de envío?</button></h2>
                <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body text-muted">Si el producto tiene stock, el envío tarda entre <strong>24 y 48 horas laborables</strong>.</div></div>
              </div>
              <div class="accordion-item border-0">
                <h2 class="accordion-header"><button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">¿Viene pintado como en la foto?</button></h2>
                <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#faqAccordion"><div class="accordion-body text-muted">Sí, las fotos de nuestro catálogo corresponden al <strong>producto final real</strong>.</div></div>
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
                            <div class="flex-shrink-0"><div class="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 45px; height: 45px; font-weight:bold;">{{ comment.user.name.charAt(0).toUpperCase() }}</div></div>
                            <div class="ms-3 w-100">
                                <div class="d-flex justify-content-between align-items-center"><h6 class="mb-0 fw-bold">{{ comment.user.name }}</h6><small class="text-muted">{{ new Date(comment.created_at).toLocaleDateString() }}</small></div>
                                <div class="text-warning small mb-1">{{ '⭐'.repeat(comment.rating) }}</div><p class="mb-1 text-secondary">{{ comment.text }}</p>
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
                    <div v-else class="alert alert-info text-center border-0 shadow-sm fs-5"><router-link to="/login" class="fw-bold text-decoration-none">Inicia sesión</router-link> para opinar.</div>
                </div>
            </div>
        </div>

      </div>
    </main>
    <transition name="slide-up">
  <div
    v-if="showStickyCart && product"
    class="sticky-cart-bar fixed-bottom shadow-lg border-top p-3 z-3"
  >
    <div class="container d-flex justify-content-between align-items-center">

      <div class="d-flex align-items-center gap-3">
        <img
          :src="getImagePath(product.image)"
          loading="lazy"
          class="rounded shadow-sm d-none d-sm-block"
          style="width: 50px; height: 50px; object-fit: cover;"
        >

        <div>
          <h6
            class="mb-0 fw-bold text-truncate"
            style="max-width: 200px;"
          >
            {{ product.name }}
          </h6>

          <span class="text-success fw-bold fs-5">
            {{ formatPrice(product.price) }}
          </span>
        </div>
      </div>

      <div class="d-flex gap-2">
        <button
          v-if="canAddToCart"
          @click="handleAddToCart"
          class="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow"
        >
          Añadir 🛒
        </button>

        <button
          v-if="canAddToCart"
          @click="handleBuyNow"
          class="btn btn-dark px-4 py-2 rounded-pill fw-bold shadow"
        >
          Comprar ⚡
        </button>
      </div>

    </div>
  </div>
</transition>
<transition name="slide-fade-up">
    <div v-if="showSocialProof" class="social-proof-toast shadow-lg rounded-pill px-4 py-2 bg-white border position-fixed z-3" style="bottom: 20px; left: 20px;">
        <small class="fw-bold text-dark" v-html="socialProofText"></small>
    </div>
</transition>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
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

const showStickyCart = ref(false);
const newComment = ref({ rating: 5, text: '' });

const averageRating = computed(() => {
    if (!comments.value.length) return 0;
    const sum = comments.value.reduce((acc, c) => acc + parseInt(c.rating), 0);
    return (sum / comments.value.length).toFixed(1);
});

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

const handleScroll = () => {
    showStickyCart.value = window.scrollY > 450;
};

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
        if (likeRes.data.likes_count !== undefined) {
            likesCount.value = likeRes.data.likes_count;
        }
    } catch (e) {
        console.error(e);
    }
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
        if (auth.user) await checkLikeStatus(id);
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const showSocialProof = ref(false);
const socialProofText = ref('');
const proofs = ["🔥 <b>3 personas</b> están viendo esto.", "📦 <b>Alguien</b> compró esto hace poco.", "❤️ <b>5 personas</b> lo tienen en favoritos."];

const triggerSocialProof = () => {
    setTimeout(() => {
        socialProofText.value = proofs[Math.floor(Math.random()*proofs.length)];
        showSocialProof.value = true;
    }, 3000);
};

onMounted(() => {
    loadProductData(route.params.id);
    triggerSocialProof();
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

watch(() => auth.user, (newUser) => {
    if (newUser && product.value) {
        checkLikeStatus(product.value.id);
    }
});

watch(() => route.params.id, (newId) => {
    if (newId) loadProductData(newId);
});

const animateLike = ref(false);
const toggleLike = async () => {
    if (!auth.user) return alert("Debes iniciar sesión.");
    try {
        const res = await axios.post(`/api/products/${product.value.id}/like`);
        isLiked.value = res.data.status === 'liked';
        likesCount.value = res.data.likes_count;
        if (isLiked.value) {
            animateLike.value = true;
            setTimeout(() => { animateLike.value = false; }, 600);
        }
    } catch (e) {
        console.error(e);
    }
};

const submitComment = async () => {
    try {
        await axios.post(`/api/products/${product.value.id}/comments`, newComment.value);
        const res = await axios.get(`/api/products/${product.value.id}/comments`);
        comments.value = res.data;
        newComment.value.text = '';
        newComment.value.rating = 5;
    } catch (e) {
        alert("Error al publicar.");
    }
};

const deleteComment = async (id) => {
    if (!confirm("¿Borrar?")) return;
    try {
        await axios.delete(`/api/comments/${id}`);
        const res = await axios.get(`/api/products/${product.value.id}/comments`);
        comments.value = res.data;
    } catch (e) {
        alert("Error al borrar.");
    }
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

const handleImageError = (e) => { e.target.src = '/img/marcaDeAgua.png'; };
const formatPrice = (p) => {
    if (p === undefined || p === null) return '0,00 €';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);
};
</script>

<style scoped>
.sticky-cart-bar { background-color: #ffffff; backdrop-filter: blur(10px); }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease-out; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); opacity: 0; }
[data-bs-theme="dark"] .sticky-cart-bar { background-color: #1e1e1e !important; border-top-color: #333 !important; }
.btn-primary { background: linear-gradient(90deg, #FF6B00, #ff8c42); border: none; }
.btn-primary:hover { background: linear-gradient(90deg, #ff8c42, #FF6B00); }
.overlay-agotado-detalle { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.7); z-index: 10; display: flex; align-items: center; justify-content: center; }
.badge-agotado-detalle { background: #dc3545; color: white; padding: 20px 40px; font-weight: bold; transform: rotate(-15deg); font-size: 2rem; border: 4px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
.transition-btn { transition: transform 0.2s; }
.transition-btn:active { transform: scale(0.95); }
@keyframes heartbeat { 0% { transform: scale(1); } 25% { transform: scale(1.3); } 50% { transform: scale(1); } 75% { transform: scale(1.3); } 100% { transform: scale(1); } }
.heartbeat-animation { animation: heartbeat 0.6s ease-in-out; }
@keyframes flicker { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
.fire-anim { animation: flicker 1s infinite alternate; }
.skeleton-box { background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%); background-size: 200% 100%; animation: skeleton-loading 1.5s infinite; border-radius: 8px; }
@keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
</style>

<style>
[data-bs-theme="dark"] .skeleton-box { background: linear-gradient(90deg, #2c2c2c 25%, #3a3a3a 50%, #2c2c2c 75%); background-size: 200% 100%; }
[data-bs-theme="dark"] .accordion-button { background-color: #242424 !important; color: #f8f9fa !important; }
[data-bs-theme="dark"] .accordion-button:not(.collapsed) { background-color: #1a1a1a !important; color: #FF6B00 !important; }
[data-bs-theme="dark"] .accordion-item { background-color: #242424 !important; border-color: #383838 !important; }
[data-bs-theme="dark"] .accordion-body { color: #ccc !important; }
[data-bs-theme="dark"] .scarcity-bar-container { background-color: #2a1b1b !important; border-color: #dc3545 !important; }
</style>