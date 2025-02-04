import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()
  const toast = useToast()
 

  // Routes publiques
  const publicRoutes = ['/',  '/inscription', '/explorer', '/admin/wallet', '/admin/transactions']
  if (publicRoutes.includes(to.path)) {
    if (auth.isAuthenticated && (to.path === '/' || to.path === '/inscription')) {
      return navigateTo(getRedirectPath(auth.state.user))
    }
    return
  }

  // Vérification de l'authentification
  if (!auth.isAuthenticated) {
    toast.error('auth/unauthorized')
    return navigateTo('/')
  }

  // Protection des routes admin
  if (to.path.startsWith('/admin') && auth.state.user?.role !== 'admin') {
    toast.error('403')
    return navigateTo('/')
  }

  // Protection des routes vendeur
  if (to.path === '/publier' && auth.state.user?.userType !== 'producer') {
    toast.error('403')
    return navigateTo('/')
  }

  // Redirection du tableau de bord
  if (to.path === '/dashboard') {
    return navigateTo(getRedirectPath(auth.state.user))
  }
})

function getRedirectPath(user: any): string {
  if (!user) return '/'
  
  if (user.role === 'admin') {
    return '/admin/dashboard'
  } else if (user.userType === 'producer') {
    return '/dashboard/SellerDashboard'
  } else {
    return '/dashboard/BuyerDashboard'
  }
}