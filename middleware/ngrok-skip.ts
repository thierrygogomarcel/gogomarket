// middleware/ngrok-skip.ts
import { defineNuxtRouteMiddleware } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async () => {
  // Si vous avez ngrok dans votre flux, ajoutez l'en-tête ngrok-skip
  if (process.env.NGROK_ACTIVE === 'true') {
    try {
      await fetch('http://localhost:3000', {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      })
    } catch (error) {
      console.error('Failed to skip ngrok browser warning:', error)
    }
  }
  // Explicitly return undefined to satisfy NavigationGuardReturn
  return
})
