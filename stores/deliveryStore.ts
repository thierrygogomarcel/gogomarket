 
import { defineStore } from 'pinia'

interface DeliveryFees {
  distance: number
  fees: number
  details: {
    baseFee: number
    distanceFee: number
    weightFee: number
  }
  estimatedTime: number
}

interface DeliveryState {
  loading: boolean
  error: string | null
}

export const useDeliveryStore = defineStore('delivery', {
  state: (): DeliveryState => ({
    loading: false,
    error: null
  }),

  actions: {
    async calculateFees(data: { origin: any, destination: any, weight: number }) {
      try {
        this.loading = true
        const response = await $fetch('/api/delivery/fees', {
          method: 'POST',
          body: data
        })
        return response as DeliveryFees
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 