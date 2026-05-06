import { defineStore } from 'pinia'
import api from '../api/axios'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        // AÑADIMOS /api/
        const response = await api.get('/api/products')
        this.products = response.data
      } catch (err) {
        this.error = 'Error al cargar productos'
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
})