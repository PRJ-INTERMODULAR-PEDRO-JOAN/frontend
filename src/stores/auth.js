import { defineStore } from 'pinia';
import axios from '../api/axios'; 
import router from '../router'; 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    errors: null
  }),
  actions: {
    // LOGIN
    async login(credentials) {
      this.loading = true;
      this.errors = null;

      localStorage.removeItem('token');
      this.token = null;
      this.user = null;
      delete axios.defaults.headers.common['Authorization'];

      try {
        // AÑADIMOS /api/
        const response = await axios.post('/api/login', credentials);
        
        this.token = response.data.accessToken;
        this.user = response.data.user;
        
        localStorage.setItem('token', this.token);
        router.push('/dashboard'); 
        
      } catch (error) {
        if (error.response && error.response.status === 401) {
            this.errors = { email: ['Credenciales incorrectas.'] };
        } else if (error.response && error.response.status === 422) {
            this.errors = error.response.data.errors;
        } else {
            console.error(error);
            this.errors = { email: ['Error del servidor.'] };
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async loginWithToken(newToken) {
        this.token = newToken;
        localStorage.setItem('token', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        await this.fetchUser();
    },

    // OBTENER USUARIO
    async fetchUser() {
      if (!this.token) return;
      
      this.loading = true;
      try {
        // AÑADIMOS /api/
        const response = await axios.get('/api/user');
        this.user = response.data;
      } catch (error) {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        this.loading = false;
      }
    },

    // LOGOUT
    async logout() {
        try {
          // AÑADIMOS /api/
          await axios.post('/api/logout', {}, { withCredentials: true });
        } catch (error) {
          console.error('Error al cerrar sesión', error);
        } finally {
          this.user = null;
          this.token = null;
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          router.push('/login'); 
        }
      }
  }
});