// stores/auth.ts
import { useCookie } from 'nuxt/app'
import { defineStore } from 'pinia' 

interface AuthState {
  token: string | null
  user: any | null
  loading: boolean
}

interface LoginResponse {
  token: string
  user: {
    role: string
    [key: string]: any
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        const response = await $fetch<LoginResponse>('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })
        
        this.token = response.token
        this.user = response.user

        // Stockage du token
        const tokenCookie = useCookie('auth_token')
        tokenCookie.value = response.token

        return response
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      const tokenCookie = useCookie('auth_token')
      tokenCookie.value = null
    }
  }
})
