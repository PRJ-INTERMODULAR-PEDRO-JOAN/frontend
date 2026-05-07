<template>
  <div>
    <button 
      class="alternar-menu" 
      :class="{ 'd-none': isCartOpen }" 
      @click="toggleMenu"
    >
      ☰
    </button>

    <aside class="barra-lateral" :class="{ 'activa': menuAbierto }">
      <div class="barra-lateral-cabecera">
        <div class="logo">
          <img src="/img/logoPrintHub.jpeg" alt="Logo de PrintHub" />
        </div>
      </div>

      <ul class="iconos-utilidad">
        <li>
          <a href="#" @click.prevent="toggleDarkMode" class="text-decoration-none d-flex align-items-center justify-content-center fw-bold">
            {{ isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro' }}
          </a>
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
          <a class="nav-link dropdown-toggle text-black" href="#" role="button" @click.prevent="toggleUserMenu">
            {{ auth.user.name }} ▾
          </a>
          <ul class="dropdown-menu dropdown-menu-end" :class="{ 'show': usuarioMenuAbierto }">
            <li><router-link class="dropdown-item" to="/dashboard" @click="closeMenu">Mi Perfil</router-link></li>
            <li><hr class="dropdown-divider"></li>
            <li><button @click="handleLogout" class="dropdown-item text-danger" style="background:none; border:none; width:100%; text-align:left;">Cerrar Sesión</button></li>
          </ul>
        </li>
        <li v-else style="list-style: none;">
          <router-link class="btn btn-outline-dark btn-sm w-100 mt-2" to="/login" @click="closeMenu">👤 Login</router-link>
        </li>
      </ul>
      
      <h3 class="etiqueta-menu">Menú</h3>
      <nav>
        <ul>
          <li><router-link to="/" @click="closeMenu">Inicio</router-link></li>
          <li class="desplegable">
            <a href="#" @click.prevent="toggleSubmenu">Maquetas Personalizadas ▾</a>
            <ul class="contenido-desplegable" :class="{ 'mostrar': submenuAbierto }">
              <li><router-link to="/products?cat=videojuegos" @click="closeMenu">Videojuegos</router-link></li>
              <li><router-link to="/products?cat=arquitectura" @click="closeMenu">Arquitectura</router-link></li>
              <li><router-link to="/products?cat=automoviles" @click="closeMenu">Automóviles</router-link></li>
            </ul>
          </li>
          <li><router-link to="/products" @click="closeMenu">Todos Nuestros Productos</router-link></li>
          <li><router-link to="/#como-funciona" @click="closeMenu">Diseñar Maquetas</router-link></li>
          <li><router-link to="/gallery" @click="closeMenu">Galería de Proyectos</router-link></li>
          <li><router-link to="/#impresoras" @click="closeMenu">Impresoras 3D</router-link></li>
          <li><a href="http://localhost:5678/form/fb9dd885-a08a-4146-a96a-5664b3560d7c" target="_blank" @click="closeMenu">Formulario Contacto</a></li>
        </ul>
      </nav>
    </aside>
  </div>

  <div class="offcanvas offcanvas-end" tabindex="-1" id="miniCart" style="width: 400px; z-index: 2000;">
    <div class="offcanvas-header bg-light border-bottom">
      <h5 class="offcanvas-title fw-bold">Resumen de Compra 🛍️</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    
    <div class="px-3 pt-3 pb-2 border-bottom progress-container" v-if="cartItems.length > 0">
      <p v-if="remainingShipping > 0" class="small fw-bold mb-1 text-center">
        Faltan <span class="text-primary">{{ formatPrice(remainingShipping) }}</span> para envío <span class="text-success">GRATIS 🚚</span>
      </p>
      <p v-else class="small fw-bold text-success mb-1 text-center">¡Ya tienes envío GRATIS! 🎉</p>
      <div class="progress" style="height: 8px; border-radius: 10px;">
        <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" :style="{ width: shippingProgress + '%' }"></div>
      </div>
    </div>

    <div class="offcanvas-body">
      <div v-if="cartItems.length === 0" class="text-center py-5">
        <div class="fs-1 mb-3">🧺</div>
        <p class="text-muted">Tu carrito está vacío.</p>
        <button class="btn btn-primary" @click="navigateTo('/products')">Ver Productos</button>
      </div>
      <div v-else>
        <div v-for="item in cartItems" :key="item.id" class="card mb-3 border-0 shadow-sm overflow-hidden">
          <div class="row g-0 align-items-center">
            <div class="col-4 p-2">
              <img :src="getImagePath(item.image)" class="img-fluid rounded" style="height: 80px; width: 100%; object-fit: cover;">
            </div>
            <div class="col-8 px-2">
              <h6 class="mb-1 fw-bold text-truncate">{{ item.name }}</h6>
              <div class="d-flex justify-content-between align-items-center mt-1">
                <span class="text-success fw-bold">{{ formatPrice(item.price) }}</span>
                <span class="badge bg-secondary">Cant: {{ item.quantity }}</span>
              </div>
              <button class="btn btn-link btn-sm text-danger p-0 mt-1 fw-bold text-decoration-none" @click="removeItem(item.id)">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="cartItems.length > 0" class="offcanvas-footer p-4 border-top bg-light">
      <div class="d-flex justify-content-between mb-3">
        <span class="h5">Total:</span>
        <span class="h5 fw-bold text-primary">{{ formatPrice(totalPrice) }}</span>
      </div>
      <div class="d-grid gap-2">
        <button class="btn btn-success btn-lg fw-bold" @click="navigateTo('/checkout')">Finalizar Pedido 💳</button>
        <button class="btn btn-outline-secondary btn-sm" @click="navigateTo('/cart')">Ver carrito completo</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '@/stores/cart';

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

const navigateTo = (path) => {
  const el = document.getElementById('miniCart');
  const instance = bootstrap.Offcanvas.getInstance(el);
  if (instance) instance.hide();
  router.push(path);
};

const handleLogout = async () => { await auth.logout(); window.location.href = '/'; };

const cartItems = computed(() => cartStore.cart || []);
const cartCount = computed(() => cartStore.totalItems || 0);
const totalPrice = computed(() => cartStore.totalPrice || 0);
const removeItem = (id) => cartStore.removeFromCart(id);

const FREE_SHIPPING_THRESHOLD = 50;
const remainingShipping = computed(() => Math.max(FREE_SHIPPING_THRESHOLD - totalPrice.value, 0));
const shippingProgress = computed(() => Math.min((totalPrice.value / FREE_SHIPPING_THRESHOLD) * 100, 100));

const formatPrice = (p) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);
const getImagePath = (img) => img ? (img.startsWith('http') ? img : `/img/${img}`) : '/img/marcaDeAgua.png';

onMounted(() => {
    auth.fetchUser();
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

<style>
/* =========================================================
   NIVEL 1: FONDO BASE (El más oscuro)
   ========================================================= */
[data-bs-theme="dark"] body, 
[data-bs-theme="dark"] #app,
[data-bs-theme="dark"] main,
[data-bs-theme="dark"] .contenido-principal,
[data-bs-theme="dark"] .layout-limpio { 
  background-color: #121212 !important; 
  color: #e0e0e0 !important; 
}

/* =========================================================
   NIVEL 2: SECCIONES ALTERNAS (Efecto Cebra en el Home)
   ========================================================= */
/* Alternamos colores en las secciones para que se note el corte entre ellas */
[data-bs-theme="dark"] .productos-destacados,
[data-bs-theme="dark"] .seccion-testimonios {
  background-color: #121212 !important; /* Fondo base */
}

[data-bs-theme="dark"] .impresoras-section,
[data-bs-theme="dark"] .seccion-sobre-nosotros,
[data-bs-theme="dark"] .bg-light {
  background-color: #1a1a1a !important; /* Gris un poco más claro para diferenciar */
}

/* =========================================================
   NIVEL 3: TARJETAS Y CAJAS (Capa superior, destacan sobre el fondo)
   ========================================================= */
[data-bs-theme="dark"] .tarjeta-producto,
[data-bs-theme="dark"] .tarjeta-testimonio,
[data-bs-theme="dark"] .card, 
[data-bs-theme="dark"] .bg-white, 
[data-bs-theme="dark"] .product-info-card,
[data-bs-theme="dark"] .product-image-wrapper { 
  background-color: #242424 !important; /* Gris mucho más claro que el fondo */
  border: 1px solid #383838 !important; /* Borde gris medio para dibujar el contorno */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5) !important; /* Sombra negra para que "floten" */
  color: #f8f9fa !important;
}

[data-bs-theme="dark"] .list-group-item {
  background-color: #242424 !important;
  border-color: #383838 !important;
  color: #f8f9fa !important;
}
[data-bs-theme="dark"] .card-header {
  background-color: #2c2c2c !important;
  border-bottom: 1px solid #383838 !important;
}

/* =========================================================
   TEXTOS Y ETIQUETAS (Legibilidad máxima)
   ========================================================= */
[data-bs-theme="dark"] h1, [data-bs-theme="dark"] h2, [data-bs-theme="dark"] h3, 
[data-bs-theme="dark"] h4, [data-bs-theme="dark"] h5, [data-bs-theme="dark"] h6,
[data-bs-theme="dark"] p, [data-bs-theme="dark"] span:not(.badge), 
[data-bs-theme="dark"] label, [data-bs-theme="dark"] .form-label,
[data-bs-theme="dark"] .text-black, [data-bs-theme="dark"] .text-dark,
[data-bs-theme="dark"] .tarjeta-producto h3,
[data-bs-theme="dark"] .tarjeta-producto .producto-descripcion,
[data-bs-theme="dark"] .tarjeta-producto .producto-precio,
[data-bs-theme="dark"] .cita-testimonio,
[data-bs-theme="dark"] .autor-testimonio {
  color: #f8f9fa !important;
}

[data-bs-theme="dark"] .text-muted, [data-bs-theme="dark"] .text-secondary { 
  color: #a0aab2 !important; /* Gris claro legible */
}

/* =========================================================
   FORMULARIOS Y BUSCADOR
   ========================================================= */
[data-bs-theme="dark"] .form-control,
[data-bs-theme="dark"] .form-select,
[data-bs-theme="dark"] .input-group-text {
  background-color: #1a1a1a !important; /* Más oscuro que la tarjeta para dar efecto "hundido" */
  color: #f8f9fa !important;
  border: 1px solid #444 !important;
}
[data-bs-theme="dark"] .form-control:focus {
  border-color: #007BFF !important;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25) !important;
}
[data-bs-theme="dark"] .form-control::placeholder { color: #777 !important; }

/* =========================================================
   FOOTER (Pie de página)
   ========================================================= */
[data-bs-theme="dark"] footer, 
[data-bs-theme="dark"] .app-footer,
[data-bs-theme="dark"] div[class*="footer"] {
  background-color: #161616 !important; /* Tono intermedio para el footer */
  color: #e0e0e0 !important;
  border-top: 1px solid #2c2c2c !important;
}
[data-bs-theme="dark"] footer a, [data-bs-theme="dark"] footer p, 
[data-bs-theme="dark"] footer span, [data-bs-theme="dark"] footer h1, 
[data-bs-theme="dark"] footer h2, [data-bs-theme="dark"] footer h3, 
[data-bs-theme="dark"] footer h4, [data-bs-theme="dark"] footer h5, 
[data-bs-theme="dark"] footer li {
  color: #e0e0e0 !important;
}

/* =========================================================
   INTERFAZ LATERAL (Aside y Mini-Carrito)
   ========================================================= */
[data-bs-theme="dark"] .barra-lateral { 
  background-color: #161616 !important; 
  border-left-color: #FF6B00 !important; 
  box-shadow: -6px 0 25px rgba(0, 0, 0, 0.5) !important;
}
[data-bs-theme="dark"] .offcanvas { background-color: #161616 !important; }
[data-bs-theme="dark"] .offcanvas-header, 
[data-bs-theme="dark"] .offcanvas-footer { background-color: #121212 !important; border-color: #2c2c2c !important; }

[data-bs-theme="dark"] .iconos-utilidad li a,
[data-bs-theme="dark"] .iconos-utilidad li button { 
  background-color: #242424 !important; 
  border: 1px solid #383838 !important; 
  color: #ffffff !important; 
}
[data-bs-theme="dark"] .barra-lateral nav ul li a { color: #ffffff !important; }
[data-bs-theme="dark"] .iconos-utilidad li a:hover,
[data-bs-theme="dark"] .barra-lateral nav ul li a:hover {
  background: linear-gradient(90deg, #007BFF, #00C6FF) !important; color: #fff !important; border-color: transparent !important;
}

[data-bs-theme="dark"] .dropdown-menu { background-color: #242424 !important; border: 1px solid #383838 !important; }
[data-bs-theme="dark"] .dropdown-item { color: #ffffff !important; }
[data-bs-theme="dark"] .dropdown-item:hover { background-color: #383838 !important; color: #fff !important; }

/* =========================================================
   BOTONES ESPECÍFICOS EN MODO OSCURO
   ========================================================= */
[data-bs-theme="dark"] .btn-dark { 
  background-color: #383838 !important; 
  border-color: #444 !important; 
  color: #fff !important; 
}
[data-bs-theme="dark"] .btn-dark:hover { background-color: #555 !important; }

[data-bs-theme="dark"] .btn-outline-dark {
  color: #f8f9fa !important;
  border-color: #555 !important;
  background-color: transparent !important;
}
[data-bs-theme="dark"] .btn-outline-dark:hover {
  background-color: #f8f9fa !important;
  color: #121212 !important;
}
</style>


<style scoped>
.d-none { display: none !important; }
.barra-lateral {
  position: fixed; top: 0; right: -260px; width: 260px; height: 100%;
  background: #ffffff; color: #1a1a1a; padding: 2rem 1rem;
  transition: right 0.4s ease; z-index: 1000;
  box-shadow: -6px 0 25px rgba(0, 0, 0, 0.08); border-left: 3px solid #FF6B00;
  border-radius: 16px 0 0 16px; overflow-y: auto;
}
.barra-lateral.activa { right: 0; }
.iconos-utilidad { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; padding: 0; }
.iconos-utilidad li a {
  color: #222; text-decoration: none; font-weight: 500; font-size: 1rem;
  display: block; padding: 0.6rem 1rem; border-radius: 10px;
  background-color: #f8f9fa; border: 1px solid #eaeaea; text-align: center;
}
.iconos-utilidad li a:hover { background: linear-gradient(90deg, #007BFF, #00C6FF); color: #fff !important; }
.barra-lateral nav ul { list-style: none; padding: 0; }
.barra-lateral nav ul li { margin: 1rem 0; }
.barra-lateral nav ul li a { color: #222; text-decoration: none; font-weight: 500; display: block; padding: 0.5rem 1rem; border-radius: 8px; }
.alternar-menu {
  position: fixed; top: 10px; right: 10px; z-index: 1100;
  background: linear-gradient(90deg, #FF6B00, #ff8c42);
  color: #fff; border: none; padding: 12px 16px; border-radius: 12px; font-size: 20px;
}
.dropdown-menu.show { display: block; position: absolute; background: white; border: 1px solid #ddd; width: 100%; z-index: 2000; }
</style>