import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useCookie } from 'nuxt/app'

interface UserData {
  id?: string
  email: string
  fullName: string
  userType: 'admin' | 'producer' | 'buyer' | 'transport'
  role: string
  status: 'active' | 'inactive'
  avatarUrl?: string
  phone?: string
  entityType?: string
}

interface AuthState {
  token: string | null
  user: UserData | null
  loading: boolean
}

export const useAuth = defineStore('auth', () => {
  const state = ref<AuthState>({
    token: useCookie('auth_token').value ?? null,
    user: null,
    loading: false,
  })

  const isAuthenticated = computed(() => !!state.value.token && !!state.value.user)

  async function login(email: string, password: string) {
    try {
      state.value.loading = true

      const response = await $fetch<{ token: string; user: UserData }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      if (!response || !response.token) {
        throw new Error('Token invalide')
      }

      state.value.token = response.token
      state.value.user = response.user

      const tokenCookie = useCookie('auth_token')
      tokenCookie.value = response.token

      return response
    } catch (error: any) {
      state.value.token = null
      state.value.user = null
      const tokenCookie = useCookie('auth_token')
      tokenCookie.value = null
      throw error
    } finally {
      state.value.loading = false
    }
  }

  function logout() {
    state.value.token = null
    state.value.user = null
    const tokenCookie = useCookie('auth_token')
    tokenCookie.value = null
  }

  return {
    state,
    isAuthenticated,
    login,
    logout
  }
})