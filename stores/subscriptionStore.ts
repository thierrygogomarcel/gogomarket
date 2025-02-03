import { defineStore } from 'pinia'

interface Subscription {
  id: string
  plan: string
  price: number
  features: string[]
  active: boolean
}

interface SubscriptionState {
  currentSubscription: Subscription | null
  loading: boolean
  error: string | null
}

export const useSubscriptionStore = defineStore('subscription', {
  state: (): SubscriptionState => ({
    currentSubscription: null,
    loading: false,
    error: null
  }),

  actions: {
    async subscribe(planId: string) {
      try {
        this.loading = true
        const response = await $fetch('/api/subscriptions/subscribe', {
          method: 'POST',
          body: { planId }
        })
        this.currentSubscription = response
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