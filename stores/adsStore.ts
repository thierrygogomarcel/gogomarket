 
import { defineStore } from 'pinia'

interface Ad {
  id: string
  productId: string
  duration: number
  budget: number
  status: 'active' | 'paused' | 'ended'
}

interface AdsState {
  ads: Ad[]
  loading: boolean
  error: string | null
}

export const useAdsStore = defineStore('ads', {
  state: (): AdsState => ({
    ads: [],
    loading: false,
    error: null
  }),

  actions: {
    async createAd(adData: Partial<Ad>) {
      try {
        this.loading = true
        const response = await $fetch('/api/ads/create', {
          method: 'POST',
          body: adData
        })
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getSponsoredAds(filters?: any) {
      try {
        this.loading = true
        const response = await $fetch('/api/ads/sponsored', {
          params: filters
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