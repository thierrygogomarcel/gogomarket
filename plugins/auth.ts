 import { defineNuxtPlugin, useCookie } from 'nuxt/app'   
import { $fetch, type FetchOptions } from 'ofetch'

export default defineNuxtPlugin((nuxtApp) => {
  // Intercepter toutes les requêtes pour ajouter le token
  const fetchInstance = $fetch.create({
    onRequest({ options }: { options: FetchOptions }) {
      const token = useCookie('auth_token').value
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        }
      }
    }
  })

  // Optionally, you can add the fetch instance to nuxtApp if needed
  nuxtApp.provide('fetchWithAuth', fetchInstance)
})