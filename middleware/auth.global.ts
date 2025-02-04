import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()
  const toast = useToast()

  // Public routes
  const publicRoutes = ['/', '/connexion', '/inscription', '/explorer']
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Check authentication
  if (!auth.isAuthenticated) {
    toast.error('Veuillez vous connecter pour accéder à cette page')
    return navigateTo('/connexion')
  }

  // Protect admin routes
  if (to.path.startsWith('/admin') && auth.state.user?.role !== 'admin') {
    toast.error('Accès non autorisé')
    return navigateTo('/')
  }

  // Protect seller routes
  if (to.path === '/publier' && auth.state.user?.userType !== 'producer') {
    toast.error('Accès non autorisé')
    return navigateTo('/')
  }
})