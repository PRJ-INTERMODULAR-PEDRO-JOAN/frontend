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
        const response = await api.get('/api/products')
        
        // CORRECCIÓN VITAL: Si es un array directo se asigna, si viene envuelto en .data se extrae.
        this.products = Array.isArray(response.data) ? response.data : (response.data.data || [])
        
      } catch (err) {
        this.error = 'Error al cargar productos'
        console.error(err)
        this.products = []
      } finally {
        this.loading = false
      }
    }
  }
})