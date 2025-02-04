import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'
import { useCookie, useRouter } from 'nuxt/app'

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
    token: useCookie<string | null>('auth_token').value,
    user: null,
    loading: false
  })
  
  const isAuthenticated = computed(() => !!state.value.token && !!state.value.user)
  const router = useRouter()

  async function login(email: string, password: string) {
    try {
      state.value.loading = true
      const response = await $fetch<{
        token: string
        user: UserData 
      }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      if (!response || !response.token) {
        throw new Error('Token invalide')
      }
  
      state.value.token = response.token
      state.value.user = response.user
      useCookie('auth_token').value = response.token

      // toast.success('composables/useAuth: Connexion réussie !')

      // Redirection based on user role
      const redirectPath = getRedirectPath(response.user)
      await router.push(redirectPath)

      return response
    } catch (error: any) {
      state.value.token = null
      state.value.user = null
      useCookie('auth_token').value = null
      console.error('❌ Erreur de connexion:', error)
      // toast.error(error.message || 'Erreur de connexion')
      throw error
    } finally {
      state.value.loading = false
    }
  }

  async function register(userData: Partial<UserData> & { password: string }) {
    try {
      state.value.loading = true
      const response = await $fetch<{
        token: string
        user: UserData
      }>('/api/auth/register', {
        method: 'POST',
        body: userData
      })

      return response
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'inscription')
      throw error
    } finally {
      state.value.loading = false
    }
  }

  function getRedirectPath(user: UserData): string {
    if (user.role === 'admin') {
      return '/admin/dashboard'
    } else if (user.userType === 'producer') {
      return '/dashboard/SellerDashboard'
    } else {
      return '/dashboard/BuyerDashboard'
    }
  }

  function logout() {
    state.value.token = null
    state.value.user = null
    useCookie('auth_token').value = null
    toast.success('Déconnexion réussie')
    router.push('/')
  }

  return {
    state,
    isAuthenticated,
    login,
    register,
    logout,
  }
})