<template>
  <MainLayout>
    <div class="contenido-principal">
      
      <a href="#destacados" class="enlace-banner" style="display:block;">
        <div class="banner">
          <div class="banner-texto">
            ¡Oferta especial de Navidad! 🦌🎅 Solo por tiempo limitado.
          </div>
        </div>
      </a>

      <section class="hero" style="background: url('/img/fondoPrincipio.webp') no-repeat center center/cover;">
        <div class="container h-100">
          <div class="row h-100 hero-fila">
            <div class="col-12 hero-contenido">
              <h1>Bienvenido/a a Print<span class="resaltado">Hub</span></h1>
              <p>Innovación y calidad en cada producto</p>
              <a href="#destacados" class="flecha">&#x25BC;</a>
            </div>
          </div>
        </div>
      </section>

      <section v-if="ofertaDia" class="py-5 banner-oferta-seccion">
        <div class="container">
          <div class="row align-items-center oferta-card rounded-4 shadow overflow-hidden p-0">
            
            <div class="col-md-6 p-0 position-relative oferta-img-container" style="min-height: 400px; display: flex; align-items: center; justify-content: center;">
              <div class="position-absolute top-0 start-0 bg-danger text-white fw-bold px-4 py-2 shadow" style="font-size: 1.5rem; z-index: 10; border-bottom-right-radius: 10px;">
                🔥 -50% HOY
              </div>
              <img :src="getImagePath(ofertaDia.image)" :alt="ofertaDia.name" loading="lazy" class="img-fluid" style="max-height: 350px; object-fit: contain;">
            </div>

            <div class="col-md-6 p-5 text-center text-md-start">
              <h4 class="text-danger fw-bold text-uppercase mb-2">⚡ Oferta Flash Exclusiva</h4>
              <h2 class="display-4 fw-bold mb-3 texto-principal">{{ ofertaDia.name }}</h2>
              <p class="lead text-muted mb-4 descripcion-oferta">{{ truncate(ofertaDia.description, 120) }}</p>
              
              <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-3 mb-4">
                <div class="text-decoration-line-through text-muted fs-3">{{ formatPrice(ofertaDia.price) }}</div>
                <div class="text-danger fw-bold display-3 animate-price">{{ formatPrice(ofertaDia.price / 2) }}</div>
              </div>

              <div class="d-flex flex-column flex-md-row gap-3 justify-content-center justify-content-md-start">
                <router-link :to="`/product/${ofertaDia.id}`" class="btn btn-outline-dark btn-lg rounded-pill px-4 btn-oferta-detalle">
                  Ver Detalles
                </router-link>
                <button class="btn btn-danger btn-lg rounded-pill px-5 shadow fw-bold animate-pulse">
                  ¡COMPRAR ANOW! 🛒
                </button>
              </div>
              
              <div class="mt-4 pt-3 border-top small text-muted descripcion-oferta">
                * Oferta válida solo durante el día de hoy. Stock limitado: <strong>{{ ofertaDia.stock }} unidades</strong>.
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="destacados" class="productos-destacados pt-5">
        <div class="container">
          <h1 class="texto-principal">Productos Destacados</h1>
          
          <div v-if="loading" class="text-center py-5 texto-principal">Cargando productos...</div>

          <div v-else class="contenedor-productos">
            <div v-for="product in destacados" :key="product.id" class="tarjeta-producto" :class="{ 'agotado': product.stock <= 0 }">
              
              <div v-if="product.stock <= 0" class="overlay-agotado">
                <span class="badge-agotado">AGOTADO</span>
              </div>
              <div v-else-if="ofertaDia && ofertaDia.id === product.id" class="badge-oferta">
                <span class="badge bg-danger shadow animate-pulse">🔥 -50%</span>
              </div>

              <img :src="getImagePath(product.image)" :alt="product.name" loading="lazy" class="imagen-maqueta" @error="handleImageError" :style="product.stock <= 0 ? 'filter: grayscale(100%); opacity: 0.5;' : ''">

              <h3 class="texto-principal">{{ product.name }}</h3>
              <p class="producto-descripcion">{{ truncate(product.description, 80) }}</p>

              <div class="d-flex justify-content-between align-items-center mb-2 mt-auto" style="width: 100%; padding: 0 10px;">
                <span v-if="ofertaDia && ofertaDia.id === product.id">
                  <span class="text-decoration-line-through text-muted small me-2">{{ formatPrice(product.price) }}</span>
                  <span class="producto-precio text-danger fw-bold">{{ formatPrice(product.price / 2) }}</span>
                </span>
                <span v-else class="producto-precio fw-bold fs-5 text-success">{{ formatPrice(product.price) }}</span>
                <small v-if="product.stock > 0 && product.stock <= 5" class="text-danger fw-bold">
                    ¡Quedan {{ product.stock }}!
                </small>
              </div>

              <router-link :to="`/products/${product.id}`" class="btn w-100 mt-2 fw-bold" :class="product.stock <= 0 ? 'btn-secondary disabled' : 'btn-primary'" :style="{ pointerEvents: product.stock <= 0 ? 'none' : 'auto' }">
                 {{ product.stock <= 0 ? 'Sin Stock' : 'Ver Detalles y Opinar' }}
              </router-link>
            </div>
            </div>
        </div>
      </section>

      <section id="impresoras" class="impresoras-section seccion-alterna">
        <div class="container">
          <h1 class="impresoras-titulo texto-principal">Nuestras Impresoras 3D</h1>
          
          <div v-if="loading" class="text-center texto-principal">Cargando impresoras...</div>
          
          <div v-else class="contenedor-productos">
            <div v-for="impresora in impresoras" :key="impresora.id" class="tarjeta-producto" :class="{ 'agotado': impresora.stock <= 0 }">
              
               <div v-if="impresora.stock <= 0" class="overlay-agotado">
                <span class="badge-agotado">AGOTADO</span>
              </div>

              <img :src="getImagePath(impresora.image)" :alt="impresora.name" loading="lazy" class="imagen-maqueta" @error="handleImageError" :style="impresora.stock <= 0 ? 'filter: grayscale(100%); opacity: 0.5;' : ''">

              <h3 class="texto-principal">{{ impresora.name }}</h3>
              <p class="producto-descripcion">{{ truncate(impresora.description, 80) }}</p>
              
               <div class="d-flex justify-content-between align-items-center mb-2 mt-auto" style="width: 100%; padding: 0 10px;">
                  <span class="producto-precio text-success fw-bold fs-5">{{ formatPrice(impresora.price) }}</span>
                   <small v-if="impresora.stock > 0 && impresora.stock <= 5" class="text-danger fw-bold">
                        ¡Quedan {{ impresora.stock }}!
                   </small>
              </div>

              <router-link :to="`/products/${impresora.id}`" class="btn w-100 mt-2 fw-bold" :class="impresora.stock <= 0 ? 'btn-secondary disabled' : 'btn-primary'" :style="{ pointerEvents: impresora.stock <= 0 ? 'none' : 'auto' }">
                {{ impresora.stock <= 0 ? 'Sin Stock' : 'Ver Detalles y Opinar' }}
              </router-link>
            </div>
             </div>
        </div>
      </section>

      <section class="seccion-sobre-nosotros">
        <div class="container">
            <div class="row gy-4 sobre-nosotros-fila">
                <div class="col-12 col-md-12 col-lg-5 gif-sobre-nosotros">
                    <img src="/img/impresora.gif" alt="GIF PrintHub" loading="lazy" class="img-fluid rounded-4 shadow-sm" />
                </div>
                <div class="col-12 col-md-12 col-lg-7 texto-sobre-nosotros">
                    <h2 class="texto-principal">Sobre Nosotros</h2>
                    <p class="text-muted">En PrintHub, nos especializamos en la creación de maquetas personalizadas utilizando tecnología de impresión 3D de última generación...</p>
                    <p class="text-muted">Ya sea que busques una figura de tu videojuego favorito, una maqueta arquitectónica o un modelo de automóvil...</p>
                </div>
            </div>
        </div>
      </section>

      <section class="video seccion-alterna py-5">
        <div class="container">
            <div class="video-wrapper">
                <h2 class="texto-principal mb-4 text-center fw-bold">Descubre Más Sobre PrintHub</h2>
                <div class="video-contenedor overflow-hidden">
                    <video autoplay loop muted playsinline preload="none" class="img-fluid w-100">
                        <source src="/img/Presentacion_Clientes_sin_con.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>
        </div>
      </section>

      <section class="seccion-testimonios py-5">
        <div class="container">
            <h2 class="texto-principal mb-5 text-center fw-bold">Qué dicen nuestros clientes</h2>
            <div class="row g-4 contenedor-testimonios">
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="tarjeta-testimonio h-100 p-4 rounded-4 shadow-sm">
                        <p class="cita-testimonio text-muted">"¡Increíble! Pedí una maqueta de mi coche soñado y el nivel de detalle es espectacular. 100% recomendado."</p>
                        <span class="autor-testimonio fw-bold texto-principal">- Carlos G.</span>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="tarjeta-testimonio h-100 p-4 rounded-4 shadow-sm">
                        <p class="cita-testimonio text-muted">"El servicio de diseño personalizado es genial. Captaron mi idea a la primera y la figura de Aatrox quedó perfecta."</p>
                        <span class="autor-testimonio fw-bold texto-principal">- Laura M.</span>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="tarjeta-testimonio h-100 p-4 rounded-4 shadow-sm">
                        <p class="cita-testimonio text-muted">"Compré mi primera impresora 3D aquí y el soporte fue excelente. Muy contenta con la Ender 3."</p>
                        <span class="autor-testimonio fw-bold texto-principal">- Javier R.</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

       <section v-if="recentlyViewed.length > 0" class="productos-destacados py-5 seccion-recientes">
        <div class="container">
          <h1 class="texto-principal mb-4">Vistos Recientemente 👁️</h1>
          
          <div class="contenedor-productos">
            <div v-for="product in recentlyViewed" :key="product.id" class="tarjeta-producto" :class="{ 'agotado': product.stock <= 0 }">
              
              <div v-if="product.stock <= 0" class="overlay-agotado">
                <span class="badge-agotado">AGOTADO</span>
              </div>

              <img :src="getImagePath(product.image)" :alt="product.name" loading="lazy" class="imagen-maqueta" @error="handleImageError" :style="product.stock <= 0 ? 'filter: grayscale(100%); opacity: 0.5;' : ''">

              <h3 class="texto-principal">{{ product.name }}</h3>
              <p class="producto-descripcion">{{ truncate(product.description, 80) }}</p>

              <div class="d-flex justify-content-between align-items-center mb-2 mt-auto" style="width: 100%; padding: 0 10px;">
                <span class="producto-precio fw-bold fs-5 text-success">{{ formatPrice(product.price) }}</span>
              </div>

              <router-link :to="`/products/${product.id}`" class="btn w-100 mt-2 fw-bold btn-outline-dark btn-volver-ver">
                 Volver a ver
              </router-link>
            </div>
          </div>
        </div>
      </section>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '../layouts/MainLayout.vue';
import axios from '../api/axios'; 

const products = ref([]);
const loading = ref(true);

const fetchProducts = async () => {
  try {
    const response = await axios.get('/api/products');
    products.value = Array.isArray(response.data) ? response.data : (response.data.data || []);
  } catch (error) {
    console.error("Error fetching products:", error);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

const impresoras = computed(() => {
    return products.value.filter(p => p.category && p.category.toLowerCase() === 'impresoras');
});

const destacados = computed(() => {
    return products.value.filter(p => !p.category || p.category.toLowerCase() !== 'impresoras');
});

const ofertaDia = computed(() => {
    if (products.value.length === 0) return null;
    return products.value.find(p => p.id === 1) || products.value[0];
});

const getImagePath = (imageName) => {
    if (!imageName) return '/img/marcaDeAgua.png';
    if (imageName.startsWith('http')) return imageName;
    return `/img/${imageName}`; 
};

const handleImageError = (e) => { e.target.src = '/img/marcaDeAgua.png'; };
const formatPrice = (price) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
const truncate = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
};

const recentlyViewed = ref([]);

onMounted(() => {
    fetchProducts();
    recentlyViewed.value = JSON.parse(localStorage.getItem('recently_viewed') || '[]');

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.innerHTML = `
    :root {
        --chat--color-primary: #ff6b00 !important;
        --chat--color-primary-shade-50: #ff8c42 !important;
        --chat--window--width: 420px !important;
        --chat--window--height: 700px !important;
        --chat--border-radius: 26px !important;
        --chat--message--bot--background: #1e293b !important;
        --chat--message--user--background: #ff6b00 !important;
    }
    .n8n-chat, .n8n-chat * { box-sizing: border-box; }
    .n8n-chat .chat-window { background: #020617 !important; border-radius: 26px !important; overflow: hidden !important; border: 1px solid rgba(255,255,255,0.06) !important; box-shadow: 0 20px 60px rgba(0,0,0,0.45) !important; }
    .n8n-chat .chat-layout, .n8n-chat .chat-wrapper { background: #020617 !important; height: 100% !important; display: flex !important; flex-direction: column !important; }
    .n8n-chat .chat-header { background: linear-gradient(135deg, #ff6b00, #ff8c42) !important; border: none !important; padding: 28px !important; }
    .n8n-chat .chat-heading h1 { color: white !important; font-size: 42px !important; font-weight: 900 !important; text-transform: uppercase !important; }
    .n8n-chat .chat-header p { color: rgba(255,255,255,0.9) !important; font-size: 16px !important; }
    .n8n-chat .chat-body { flex: 1 !important; overflow-y: auto !important; background: linear-gradient(to bottom, #0f172a, #020617) !important; padding: 24px !important; }
    .n8n-chat .chat-messages-list { display: flex !important; flex-direction: column !important; gap: 18px !important; }
    .n8n-chat .chat-message { background: transparent !important; border: none !important; padding: 0 !important; margin: 0 !important; }
    .n8n-chat .chat-message-from-bot { display: flex !important; justify-content: flex-start !important; }
    .n8n-chat .chat-message-from-bot .chat-message-markdown { background: #1e293b !important; color: white !important; padding: 16px 18px !important; border-radius: 20px 20px 20px 8px !important; max-width: 80% !important; line-height: 1.5 !important; box-shadow: 0 8px 20px rgba(0,0,0,0.25) !important; }
    .n8n-chat .chat-message-from-user { display: flex !important; justify-content: flex-end !important; }
    .n8n-chat .chat-message-from-user .chat-message-markdown { background: linear-gradient(135deg, #ff6b00, #ff8c42) !important; color: white !important; padding: 16px 18px !important; border-radius: 20px 20px 8px 20px !important; max-width: 80% !important; line-height: 1.5 !important; box-shadow: 0 8px 20px rgba(255,107,0,0.25) !important; }
    .n8n-chat .chat-footer { background: #0f172a !important; border-top: 1px solid rgba(255,255,255,0.06) !important; padding: 16px !important; }
    .n8n-chat .chat-input, .n8n-chat .chat-inputs, .n8n-chat .chat-inputs-controls { background: transparent !important; border: none !important; box-shadow: none !important; }
    .n8n-chat .chat-inputs { display: flex !important; align-items: center !important; gap: 12px !important; }
    .n8n-chat textarea { flex: 1 !important; background: #1e293b !important; color: white !important; border: 2px solid rgba(255,255,255,0.06) !important; border-radius: 18px !important; padding: 16px !important; min-height: 58px !important; resize: none !important; outline: none !important; }
    .n8n-chat textarea::placeholder { color: rgba(255,255,255,0.5) !important; }
    .n8n-chat textarea:focus { border-color: #ff6b00 !important; box-shadow: 0 0 0 4px rgba(255,107,0,0.15) !important; }
    .n8n-chat .chat-input-send-button { width: 58px !important; height: 58px !important; border-radius: 16px !important; background: linear-gradient(135deg, #ff6b00, #ff8c42) !important; border: none !important; color: white !important; transition: .25s ease !important; }
    .n8n-chat .chat-input-send-button:hover { transform: scale(1.05); box-shadow: 0 10px 25px rgba(255,107,0,0.35); }
    .n8n-chat .chat-window-toggle { width: 72px !important; height: 72px !important; border-radius: 50% !important; background: linear-gradient(135deg, #ff6b00, #ff8c42) !important; color: white !important; box-shadow: 0 12px 35px rgba(255,107,0,0.35) !important; }
    .n8n-chat ::-webkit-scrollbar { width: 8px; }
    .n8n-chat ::-webkit-scrollbar-thumb { background: #ff6b00; border-radius: 999px; }
    @media (max-width: 768px) { .n8n-chat .chat-window { width: 100vw !important; height: 100vh !important; border-radius: 0 !important; } }
    `;
    document.head.appendChild(style);

    import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
        .then(module => {
            module.createChat({
                webhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL,
                mode: 'window',
                showWelcomeScreen: true,
                defaultLanguage: 'es',
                initialMessages: [
                    '¡Hola! 👋',
                    'Soy tu asistente IA. ¿En qué puedo ayudarte?'
                ],
                i18n: {
                    es: {
                        title: 'Asistente IA 🚀',
                        subtitle: 'Disponible 24/7 para ayudarte',
                        footer: '',
                        getStarted: 'Nueva conversación',
                        inputPlaceholder: 'Escribe tu mensaje...'
                    }
                }
            });
        })
        .catch(err => {
            console.error('Error cargando el chatbot de n8n:', err);
        });
});
</script>

<style scoped>
@import '../assets/css/home-scoped.css';
</style>

<style>
@import '../assets/css/home-dark.css';
</style>