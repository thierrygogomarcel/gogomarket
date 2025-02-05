import { defineStore } from 'pinia'

interface WalletState {
  balance: number
  transactions: any[]
  loading: boolean
  error: string | null
}

interface WalletResponse {
  newBalance: number
  message?: string
}

export const useWalletStore = defineStore('wallet', {
  state: (): WalletState => ({
    balance: 0,
    transactions: [],
    loading: false,
    error: null
  }),

  actions: {
    async topUp(amount: number) {
      try {
        this.loading = true
        const response = await $fetch<WalletResponse>('/api/wallet/topup', {
          method: 'POST',
          body: { amount }
        })
        this.balance = response.newBalance
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async withdraw(amount: number) {
      try {
        this.loading = true
        const response = await $fetch<WalletResponse>('/api/wallet/withdraw', {
          method: 'POST',
          body: { amount }
        })
        this.balance = response.newBalance
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