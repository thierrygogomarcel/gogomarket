 import { defineStore } from 'pinia'
import { type Product, type ProductListResponse } from '../types/product'

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
}

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async createProduct(productData: Partial<Product>): Promise<Product> {
      try {
        this.loading = true
        const response = await $fetch<Product>('/api/products/create', {
          method: 'POST',
          body: productData
        })
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getProducts(filters?: any): Promise<ProductListResponse> {
      try {
        this.loading = true
        const response = await $fetch<ProductListResponse>('/api/products', {
          params: filters
        })
        this.products = response.products
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
      try {
        this.loading = true
        const response = await $fetch<Product>(`/api/products/${id}`, {
          method: 'PUT',
          body: data
        })
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id: string): Promise<void> {
      try {
        this.loading = true
        await $fetch(`/api/products/${id}`, {
          method: 'DELETE'
        })
        this.products = this.products.filter(p => p.id !== id)
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async compareProducts(productIds: string[]): Promise<Product[]> {
      try {
        this.loading = true
        const response = await $fetch<Product[]>('/api/products/compare', {
          method: 'POST',
          body: { productIds }
        })
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})