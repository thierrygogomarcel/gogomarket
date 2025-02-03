import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useToast } from '~/composables/useToast'

// Define an interface for the error object
interface RouteError {
  statusCode: number
  message?: string
}

export default defineNuxtRouteMiddleware((to, from) => {
  const toast = useToast()

  // Handle route errors
  if (to.meta.error) {
    const error = to.meta.error as RouteError
    if (error.statusCode === 404) {
      return navigateTo('/404')
    }
    
    toast.error(error.statusCode.toString())
    return navigateTo('/')
  }
})