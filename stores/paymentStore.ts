import { defineStore } from 'pinia'

interface PaymentState {
  transactions: any[]
  loading: boolean
  error: string | null
}

export const usePaymentStore = defineStore('payment', {
  state: (): PaymentState => ({
    transactions: [],
    loading: false,
    error: null
  }),

  actions: {
    async initiatePayment(data: any) {
      try {
        this.loading = true
        const response = await $fetch('/api/payments/initiate', {
          method: 'POST',
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

    async checkTransactionStatus(transactionId: string) {
      try {
        const response = await $fetch(`/api/payments/status/${transactionId}`)
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    }
  }
})