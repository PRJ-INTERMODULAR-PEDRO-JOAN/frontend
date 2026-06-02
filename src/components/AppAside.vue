<template>
  <div>
    <button class="alternar-menu" :class="{ 'd-none': isCartOpen }" @click="toggleMenu">☰</button>

    <aside class="barra-lateral" :class="{ 'activa': menuAbierto }">
      <div class="barra-lateral-cabecera">
        <div class="logo">
          <img src="/img/logoPrintHub.jpeg" alt="Logo de PrintHub" />
        </div>
      </div>

      <!-- BUSCADOR PREDICTIVO -->
      <div class="px-2 mb-4 position-relative">
        <div class="input-group input-group-sm shadow-sm">
          <span class="input-group-text bg-white border-end-0">🔍</span>
          <input type="text" class="form-control border-start-0 py-2" v-model="liveSearchQuery" placeholder="Buscar maqueta rápida...">
        </div>
        <ul v-if="liveSearchResults.length > 0" class="list-group position-absolute w-100 shadow-lg mt-1 z-3 live-search-results" style="max-height: 250px; overflow-y: auto;">
          <li v-for="res in liveSearchResults" :key="res.id" class="list-group-item list-group-item-action p-2 border-0 border-bottom" @click="goToProduct(res.id)" style="cursor:pointer;">
            <div class="d-flex align-items-center gap-2">
              <img :src="getImagePath(res.image)" class="rounded" style="width: 40px; height: 40px; object-fit: cover;">
              <div class="text-truncate">
                <div class="fw-bold text-truncate" style="font-size: 0.85rem; max-width: 140px;">{{ res.name }}</div>
                <div class="text-success fw-bold" style="font-size: 0.8rem;">{{ formatPrice(res.price) }}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <ul class="iconos-utilidad">
        <!-- TOGGLE ANIMADO MODO OSCURO -->
        <li class="d-flex align-items-center justify-content-between px-3 py-2 rounded-3 border theme-toggle-box mb-2 shadow-sm" style="background-color: #f8f9fa;">
          <span class="fw-bold d-flex align-items-center gap-2 text-dark" style="font-size: 0.9rem;">
            {{ isDarkMode ? '🌙 Oscuro' : '☀️ Claro' }}
          </span>
          <div class="form-check form-switch m-0 p-0">
            <input class="form-check-input ms-0 custom-switch shadow-none" type="checkbox" role="switch" :checked="isDarkMode" @change="toggleDarkMode" style="cursor: pointer;">
          </div>
        </li>

        <li>
          <a href="#" class="position-relative text-decoration-none d-flex align-items-center justify-content-center" data-bs-toggle="offcanvas" data-bs-target="#miniCart" @click="closeMenu">
            🛒 Mi Carrito
            <span v-if="cartCount > 0" class="badge bg-danger ms-2 rounded-pill">{{ cartCount }}</span>
          </a>
        </li>
        <li><router-link to="/wishlist" class="nav-link text-danger" @click="closeMenu">❤️ Favoritos</router-link></li>
        <li><router-link to="/mis-pedidos" class="nav-link" @click="closeMenu">📦 Mis Pedidos</router-link></li>
        
        <li v-if="auth.user" class="nav-item dropdown" style="list-style: none; position: relative;">
          <a class="nav-link dropdown-toggle text-black" href="#" role="button" @click.prevent="toggleUserMenu">{{ auth.user.name }} ▾</a>
          <ul class="dropdown-menu dropdown-menu-end" :class="{ 'show': usuarioMenuAbierto }">
            <li><router-link class="dropdown-item" to="/dashboard" @click="closeMenu">Mi Perfil</router-link></li>
            <li><hr class="dropdown-divider"></li>
            <li><button @click="handleLogout" class="dropdown-item text-danger" style="background:none; border:none; width:100%; text-align:left;">Cerrar Sesión</button></li>
          </ul>
        </li>
        <li v-else style="list-style: none;"><router-link class="btn btn-outline-dark btn-sm w-100 mt-2" to="/login" @click="closeMenu">👤 Login</router-link></li>
      </ul>
      
      <h3 class="etiqueta-menu mt-2">Menú</h3>
      <nav>
        <ul>
          <li><router-link to="/" @click="closeMenu">Inicio</router-link></li>
          <li class="desplegable">
            <a href="#" @click.prevent="toggleSubmenu">Maquetas Personalizadas ▾</a>
            <!-- MEGA-MENÚ VISUAL -->
            <ul class="contenido-desplegable p-1 rounded-3 border mt-1 mega-menu-box shadow-sm" :class="{ 'mostrar': submenuAbierto }" style="background: #fff; list-style: none;">
              <li><router-link to="/products?cat=videojuegos" class="d-flex align-items-center gap-2 p-2 rounded text-decoration-none mega-item" @click="closeMenu">
                <span>🎮</span> <span class="fw-bold text-dark title-mega" style="font-size: 0.9rem;">Videojuegos</span>
              </router-link></li>
              <li><router-link to="/products?cat=arquitectura" class="d-flex align-items-center gap-2 p-2 rounded text-decoration-none mega-item" @click="closeMenu">
                <span>🏛️</span> <span class="fw-bold text-dark title-mega" style="font-size: 0.9rem;">Arquitectura</span>
              </router-link></li>
              <li><router-link to="/products?cat=automoviles" class="d-flex align-items-center gap-2 p-2 rounded text-decoration-none mega-item" @click="closeMenu">
                <span>🏎️</span> <span class="fw-bold text-dark title-mega" style="font-size: 0.9rem;">Automóviles</span>
              </router-link></li>
            </ul>
          </li>
          <li><router-link to="/products" @click="closeMenu">Todos Nuestros Productos</router-link></li>
          <li><router-link to="/segunda-mano">Segunda Mano</router-link></li>          
          <li><router-link to="/gallery" @click="closeMenu">Galería de Proyectos</router-link></li>
          <li><router-link to="/#impresoras" @click="closeMenu">Impresoras 3D</router-link></li>
          <li><a href="http://localhost:5678/form/fb9dd885-a08a-4146-a96a-5664b3560d7c" target="_blank" @click="closeMenu">Formulario Contacto</a></li>
        </ul>
      </nav>
    </aside>
  </div>

  <!-- OFFCANVAS MINI-CARRITO -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="miniCart" style="width: 400px; z-index: 2000;">
    <div class="offcanvas-header bg-light border-bottom">
      <h5 class="offcanvas-title fw-bold">Resumen de Compra 🛍️</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="px-3 pt-3 pb-2 border-bottom progress-container" v-if="cartItems.length > 0">
      <p v-if="remainingShipping > 0" class="small fw-bold mb-1 text-center">Faltan <span class="text-primary">{{ formatPrice(remainingShipping) }}</span> para envío <span class="text-success">GRATIS 🚚</span></p>
      <div class="progress" style="height: 8px;"><div class="progress-bar progress-bar-striped progress-bar-animated bg-success" :style="{ width: shippingProgress + '%' }"></div></div>
    </div>
    <div class="offcanvas-body">
      <div v-if="cartItems.length === 0" class="text-center py-5"><p class="text-muted">Tu carrito está vacío.</p></div>
      <div v-else>
        <div v-for="item in cartItems" :key="item.id" class="card mb-3 border-0 shadow-sm">
          <div class="row g-0 align-items-center">
            <div class="col-4 p-2"><img :src="getImagePath(item.image)" class="img-fluid rounded" style="height: 80px; object-fit: cover;"></div>
            <div class="col-8 px-2">
              <h6 class="mb-1 fw-bold">{{ item.name }}</h6>
              <div class="d-flex justify-content-between align-items-center">
                <div class="input-group input-group-sm" style="width: 80px;">
                  <button class="btn btn-outline-secondary" @click="decreaseQty(item)">-</button>
                  <input type="text" class="form-control text-center px-0" :value="item.quantity" readonly>
                  <button class="btn btn-outline-secondary" @click="increaseQty(item)">+</button>
                </div>
                <button class="btn btn-link btn-sm text-danger" @click="removeItem(item.id)">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="cartItems.length > 0" class="offcanvas-footer p-4 border-top">
      <div class="d-flex justify-content-between mb-3"><span class="h5">Total:</span><span class="h5 fw-bold text-primary">{{ formatPrice(totalPrice) }}</span></div>
      <button class="btn btn-success w-100 fw-bold" @click="navigateTo('/checkout')">Finalizar Pedido 💳</button>
      <button class="btn btn-outline-secondary w-100 mt-2 btn-sm" @click="navigateTo('/cart')">Ver carrito completo</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '@/stores/cart';
import axios from '../api/axios';

const auth = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const menuAbierto = ref(false);
const submenuAbierto = ref(false);
const usuarioMenuAbierto = ref(false);
const isCartOpen = ref(false);
const isDarkMode = ref(false);

const toggleMenu = () => { menuAbierto.value = !menuAbierto.value; };
const toggleSubmenu = () => { submenuAbierto.value = !submenuAbierto.value; };
const toggleUserMenu = () => { usuarioMenuAbierto.value = !usuarioMenuAbierto.value; };
const closeMenu = () => { menuAbierto.value = false; };

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  const theme = isDarkMode.value ? 'dark' : 'light';
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem('theme', theme);
};

// --- CORRECCIÓN: EVITAR SALTO AL NAVEGAR DESDE EL OFFCANVAS ---
const navigateTo = (path) => {
  const el = document.getElementById('miniCart');
  const instance = bootstrap.Offcanvas.getInstance(el);
  
  if (instance) {
    // Esperamos a que Bootstrap termine su animación y restaure el scrollbar
    el.addEventListener('hidden.bs.offcanvas', function handler() {
      router.push(path);
      el.removeEventListener('hidden.bs.offcanvas', handler);
    }, { once: true });
    
    instance.hide();
  } else {
    router.push(path);
  }
};
// -------------------------------------------------------------

const liveSearchQuery = ref('');
const allProducts = ref([]);
const liveSearchResults = computed(() => {
  if (liveSearchQuery.value.trim().length < 2) return [];
  const q = liveSearchQuery.value.toLowerCase();
  return allProducts.value.filter(p => p.name.toLowerCase().includes(q)).slice(0, 5);
});
const goToProduct = (id) => { liveSearchQuery.value = ''; closeMenu(); router.push(`/products/${id}`); };

const handleLogout = async () => { await auth.logout(); window.location.href = '/'; };
const cartItems = computed(() => cartStore.cart || []);
const cartCount = computed(() => cartStore.totalItems || 0);
const totalPrice = computed(() => cartStore.totalPrice || 0);
const removeItem = (id) => cartStore.removeFromCart(id);
const increaseQty = (item) => { if (item.quantity < item.stock) item.quantity++; else alert("Sin stock"); };
const decreaseQty = (item) => { if (item.quantity > 1) item.quantity--; else removeItem(item.id); };
const FREE_SHIPPING_THRESHOLD = 50;
const remainingShipping = computed(() => Math.max(FREE_SHIPPING_THRESHOLD - totalPrice.value, 0));
const shippingProgress = computed(() => Math.min((totalPrice.value / FREE_SHIPPING_THRESHOLD) * 100, 100));
const formatPrice = (p) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);
const getImagePath = (img) => img ? (img.startsWith('http') ? img : `/img/${img}`) : '/img/marcaDeAgua.png';

onMounted(async () => {
    auth.fetchUser();
    try { const res = await axios.get('/api/products'); allProducts.value = res.data; } catch (e) {}
    const savedTheme = localStorage.getItem('theme') || 'light';
    isDarkMode.value = savedTheme === 'dark';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    const el = document.getElementById('miniCart');
    if (el) {
        el.addEventListener('show.bs.offcanvas', () => { isCartOpen.value = true; });
        el.addEventListener('hidden.bs.offcanvas', () => { isCartOpen.value = false; });
    }
});
</script>

<style scoped>
.d-none { display: none !important; }
.barra-lateral { position: fixed; top: 0; right: -260px; width: 260px; height: 100%; background: #ffffff; color: #1a1a1a; padding: 2rem 1rem; transition: right 0.4s ease; z-index: 1000; box-shadow: -6px 0 25px rgba(0, 0, 0, 0.08); border-left: 3px solid #FF6B00; border-radius: 16px 0 0 16px; overflow-y: auto; }
.barra-lateral.activa { right: 0; }
.iconos-utilidad { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; padding: 0; }
.iconos-utilidad li a { color: #222; text-decoration: none; font-weight: 500; font-size: 1rem; display: block; padding: 0.6rem 1rem; border-radius: 10px; background-color: #f8f9fa; border: 1px solid #eaeaea; text-align: center; }
.iconos-utilidad li a:hover { background: linear-gradient(90deg, #007BFF, #00C6FF); color: #fff !important; }
.barra-lateral nav ul { list-style: none; padding: 0; }
.barra-lateral nav ul li { margin: 1rem 0; }
.barra-lateral nav ul li a { color: #222; text-decoration: none; font-weight: 500; display: block; padding: 0.5rem 1rem; border-radius: 8px; }
.alternar-menu { position: fixed; top: 10px; right: 10px; z-index: 1100; background: linear-gradient(90deg, #FF6B00, #ff8c42); color: #fff; border: none; padding: 12px 16px; border-radius: 12px; font-size: 20px; }
.dropdown-menu.show { display: block; position: absolute; background: white; border: 1px solid #ddd; width: 100%; z-index: 2000; }
.mega-item { transition: all 0.2s; border: 1px solid transparent; }
.mega-item:hover { background-color: #f8f9fa; border-color: #eaeaea; transform: translateX(5px); }
.theme-toggle-box { transition: all 0.3s ease; }
</style>

<style>
/* CSS MODO OSCURO GLOBAL */
[data-bs-theme="dark"] body, [data-bs-theme="dark"] #app, [data-bs-theme="dark"] main { background-color: #121212 !important; color: #e0e0e0 !important; }
[data-bs-theme="dark"] .barra-lateral { background-color: #161616 !important; border-left-color: #FF6B00 !important; }
[data-bs-theme="dark"] .barra-lateral nav ul li a { color: #ffffff !important; }
[data-bs-theme="dark"] .barra-lateral nav ul li a:hover { background: #2c2c2c !important; }
[data-bs-theme="dark"] .iconos-utilidad li a, [data-bs-theme="dark"] .theme-toggle-box { background-color: #242424 !important; border-color: #383838 !important; color: #ffffff !important; }
[data-bs-theme="dark"] .offcanvas { background-color: #161616 !important; color: #f8f9fa !important; }
[data-bs-theme="dark"] .offcanvas-header, [data-bs-theme="dark"] .offcanvas-footer { background-color: #121212 !important; border-color: #2c2c2c !important; }
[data-bs-theme="dark"] .input-group .form-control, [data-bs-theme="dark"] .input-group-text { background-color: #1a1a1a !important; color: #fff !important; border-color: #444 !important; }
[data-bs-theme="dark"] .mega-menu-box { background-color: #242424 !important; border-color: #383838 !important; }
[data-bs-theme="dark"] .title-mega { color: #f8f9fa !important; }
[data-bs-theme="dark"] .mega-item:hover { background-color: #383838 !important; border-color: #444 !important; }
</style>