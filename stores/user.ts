import { defineStore } from 'pinia'
import { useToast } from '~/composables/useToast'

export interface User {
  profilePicture: any
  id: string
  email: string
  fullName: string
  userType: 'producer' | 'buyer' | 'transport' | 'admin'
  role: string
  status: 'active' | 'inactive'
  avatarUrl?: string
  createdAt?: string | Date
  phone?: string
  lastLoginAt?: string | Date
}

export interface UserStats {
  totalOrders: number;
  totalRevenue: number;
  activeProducts: number;
  lastOrderDate?: string;
  purchasesCount?: number;
}

interface UserState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isProducer: (state) => state.user?.userType === 'producer',
    isBuyer: (state) => state.user?.userType === 'buyer',
    isTransporter: (state) => state.user?.userType === 'transport'
  },

  actions: {
    async fetchUser() {
      const toast = useToast()
      try {
        this.loading = true
        const response = await $fetch('/api/users/profile')
        this.user = response as User
      } catch (error: any) {
        this.error = error.message
        toast.error(error.message)
      } finally {
        this.loading = false
      }
    },

    clearUser() {
      this.user = null
      this.error = null
    }
  }
})