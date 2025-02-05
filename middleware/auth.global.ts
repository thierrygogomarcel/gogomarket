import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

// Définition d'un middleware de route pour Nuxt
export default defineNuxtRouteMiddleware((to: { path: string }) => {
  const auth = useAuth() // Récupération de l'état d'authentification
  const toast = useToast() // Récupération du service de notifications

  console.log(`Navigation vers : ${to.path}`) // Log pour suivre la route demandée

  // Liste des routes accessibles sans authentification
  const publicRoutes = ['/', '/connexion', '/inscription', '/explorer']
  if (publicRoutes.includes(to.path)) {
    console.log('Route publique, accès autorisé')
    return // L'utilisateur peut accéder librement
  }

  // Vérification de l'authentification
  if (!auth.isAuthenticated) {
    console.warn('Utilisateur non authentifié, redirection vers /connexion')
    toast.error('Veuillez vous connecter pour accéder à cette page')
    return navigateTo('/connexion') // Redirige l'utilisateur vers la page de connexion
  }

  // Vérification des autorisations pour accéder aux routes administratives
  if (to.path.startsWith('/admin') && auth.state?.user?.role !== 'admin') {
    console.warn('Accès non autorisé à une route admin, redirection vers la page d’accueil')
    toast.error('Accès non autorisé')
    return navigateTo('/') // Redirige l'utilisateur s'il n'est pas admin
  }

  // Vérification des autorisations pour publier une annonce (réservé aux producteurs)
  if (to.path === '/publier' && auth.state?.user?.userType !== 'producer') {
    console.warn('Accès non autorisé à la publication, redirection vers la page d’accueil')
    toast.error('Accès non autorisé')
    return navigateTo('/') // Redirige l'utilisateur s'il n'est pas producteur
  }

  console.log('Accès autorisé à la route demandée')
})
