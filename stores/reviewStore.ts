import { defineStore } from 'pinia'

interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  comment: string
  createdAt: Date
}

interface ReviewState {
  reviews: Record<string, Review[]>
  loading: boolean
  error: string | null
}

export const useReviewStore = defineStore('review', {
  state: (): ReviewState => ({
    reviews: {},
    loading: false,
    error: null
  }),

  actions: {
    async createReview(data: { productId: string; rating: number; comment: string }) {
      try {
        this.loading = true
        const response = await $fetch('/api/reviews/create', {
          method: 'POST',
          body: data
        })
        
        if (!this.reviews[data.productId]) {
          this.reviews[data.productId] = []
        }
        this.reviews[data.productId].push(response)
        
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async loadReviews(productId: string) {
      try {
        this.loading = true
        const response = await $fetch(`/api/reviews/${productId}`)
        this.reviews[productId] = response.reviews
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