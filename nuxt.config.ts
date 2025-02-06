import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: true,

  nitro: {
    preset: 'node',
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || '', 
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h', 
    mongodbUri: process.env.MONGODB_URI,

    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      auth: { // 👉 Déplacer la config ici
        isEnabled: true,
        baseURL: '/api/auth',
        provider: {
          type: 'local'
        }
      }
    }
  },

  modules: [
    '@sidebase/nuxt-auth',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode'
  ],

  css: [
    'assets/css/style.css',
    'vue3-toastify/dist/index.css'
  ],

  build: {
    transpile: ['vue3-toastify']
  },

  compatibilityDate: '2025-02-05'
});
