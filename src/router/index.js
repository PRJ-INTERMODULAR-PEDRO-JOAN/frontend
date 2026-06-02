import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth' 
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import GalleryView from '../views/GalleryView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductDetail from '../views/ProductDetail.vue'
import ProductEdit from '../views/ProductEdit.vue'
import OAuthCallback from '../views/OAuthCallback.vue';
import OrdersHistoryView from '../views/OrdersHistoryView.vue';
import WishlistView from '../views/WishlistView.vue';

// Importaciones del Carrito
import CartView from '../views/CartView.vue'
// Asegúrate de crear estos dos archivos también si quieres el flujo completo, 
// o comenta estas líneas si solo estás probando el botón de añadir.
import CheckoutView from '../views/CheckoutView.vue' 
import OrderSuccessView from '../views/OrderSuccessView.vue' 




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView, meta: { guest: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { guest: true } },
    { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/gallery', name: 'gallery', component: GalleryView },
    { path: '/products', name: 'products', component: ProductsView },
    { 
      path: '/products/:id', 
      name: 'product.show', 
      component: ProductDetail, 
      props: true 
    },
    { 
      path: '/products/:id/edit', 
      name: 'product.edit', 
      component: ProductEdit, 
      props: true, 
      meta: { requiresAuth: true, requiresAdmin: true } 
    },
    // --- RUTAS DEL CARRITO ---
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView, // Necesitarás crear este archivo (basado en el código anterior)
      meta: { requiresAuth: true }
    },
    {
      path: '/order-success',
      name: 'order-success',
      component: OrderSuccessView, // Necesitarás crear este archivo
      meta: { requiresAuth: true }
    },
    {
      path: '/oauth/callback',
      name: 'oauth-callback',
      component: OAuthCallback
    },
    {
      path: '/mis-pedidos',
      name: 'orders',
      component: OrdersHistoryView,
      meta: { requiresAuth: true } // Protegida
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: WishlistView,
      meta: { requiresAuth: true } // Protegida
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
    {
      path: '/segunda-mano',
      name: 'segunda-mano',
      component: () => import('../views/SecondHandView.vue')
    }
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // Si el usuario usa los botones de "Atrás" o "Adelante" del navegador, 
      // lo dejamos exactamente en la posición donde estaba leyendo.
      return savedPosition;
    } else {
      // Si hace clic en un enlace normal del menú o catálogo, 
      // la página hace scroll hacia arriba de forma suave.
      return { top: 0, behavior: 'smooth' };
    }
  }
})

// GUARDIA DE NAVEGACIÓN (Sin cambios)
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdmin = auth.user && auth.user.role === 'admin';

  if (to.meta.requiresAuth && !isAuthenticated) next({ name: 'login' });
  else if (to.meta.requiresAdmin && !isAdmin) next({ name: 'home' });
  else if (to.meta.guest && isAuthenticated) next({ name: 'dashboard' });
  else next();
});

export default router