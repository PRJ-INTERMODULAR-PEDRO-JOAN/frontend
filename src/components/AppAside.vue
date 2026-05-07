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
        <h1 class="logo-texto">Print<span class="resaltado">Hub</span></h1>
        <div class="logo">
            <img src="/img/logoPrintHub.jpeg" alt="Logo de PrintHub" />
        </div>
      </div>

      <ul class="iconos-utilidad">
        <li>
          <a href="#" class="position-relative text-decoration-none d-flex align-items-center justify-content-center" data-bs-toggle="offcanvas" data-bs-target="#miniCart" @click="closeMenu">
            🛒 Mi Carrito
            <span v-if="cartCount > 0" class="badge bg-danger ms-2 rounded-pill">
              {{ cartCount }}
            </span>
          </a>
        </li>

        <li>
          <router-link to="/wishlist" class="nav-link text-danger" @click="closeMenu">❤️ Favoritos</router-link>
        </li>
        <li>
          <router-link to="/mis-pedidos" class="nav-link" @click="closeMenu">📦 Mis Pedidos</router-link>
        </li>
        
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
            <li>
              <a href="http://localhost:5678/form/fb9dd885-a08a-4146-a96a-5664b3560d7c" target="_blank" @click="closeMenu">
                Formulario Contacto
              </a>
            </li>
             
            <li v-if="auth.user && auth.user.role === 'admin'">
                <a href="http://localhost/admin/import" style="color: black;" @click="closeMenu">Importar Productos</a>
            </li>
        </ul>
      </nav>
    </aside>
  </div>

  <div class="offcanvas offcanvas-end" tabindex="-1" id="miniCart" style="width: 400px; z-index: 2000;">
    <div class="offcanvas-header bg-light border-bottom">
      <h5 class="offcanvas-title fw-bold">Resumen de Compra 🛍️</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
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
              <button class="btn btn-link btn-sm text-danger p-0 mt-1" @click="removeItem(item.id)">Eliminar</button>
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

// Estados
const menuAbierto = ref(false);
const submenuAbierto = ref(false);
const usuarioMenuAbierto = ref(false);
const isCartOpen = ref(false);

const toggleMenu = () => { menuAbierto.value = !menuAbierto.value; };
const toggleSubmenu = () => { submenuAbierto.value = !submenuAbierto.value; };
const toggleUserMenu = () => { usuarioMenuAbierto.value = !usuarioMenuAbierto.value; };
const closeMenu = () => { menuAbierto.value = false; };

// Navegación manual para cerrar el carrito
const navigateTo = (path) => {
  const el = document.getElementById('miniCart');
  const instance = bootstrap.Offcanvas.getInstance(el);
  if (instance) instance.hide();
  router.push(path);
};

const handleLogout = async () => { await auth.logout(); window.location.href = '/'; };

// Carrito
const cartItems = computed(() => cartStore.cart || []);
const cartCount = computed(() => cartStore.totalItems || 0);
const totalPrice = computed(() => cartStore.totalPrice || 0);

const removeItem = (id) => cartStore.removeFromCart(id);
const formatPrice = (p) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);
const getImagePath = (img) => img ? (img.startsWith('http') ? img : `/img/${img}`) : '/img/marcaDeAgua.png';

onMounted(() => {
    auth.fetchUser();
    const el = document.getElementById('miniCart');
    if (el) {
        el.addEventListener('show.bs.offcanvas', () => { isCartOpen.value = true; });
        el.addEventListener('hidden.bs.offcanvas', () => { isCartOpen.value = false; });
    }
});
</script>

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
.barra-lateral nav ul li a:hover { background: #f0f0f0; }

.contenido-desplegable { list-style: none; padding-left: 15px; max-height: 0; opacity: 0; overflow: hidden; transition: 0.5s ease; }
.contenido-desplegable.mostrar { max-height: 500px; opacity: 1; }

.alternar-menu {
  position: fixed; top: 10px; right: 10px; z-index: 1100;
  background: linear-gradient(90deg, #FF6B00, #ff8c42);
  color: #fff; border: none; padding: 12px 16px; border-radius: 12px; font-size: 20px;
}

.dropdown-menu.show { display: block; position: absolute; background: white; border: 1px solid #ddd; width: 100%; z-index: 2000; }
</style>