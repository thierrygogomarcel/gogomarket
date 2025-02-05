import { defineNuxtConfig } from "nuxt/config";

// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,

  nitro: {
    preset: 'node',
  },

  runtimeConfig: {
    // Variables privées côté serveur
    jwtSecret: process.env.JWT_SECRET || '', 
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h', 
    mongodbUri: process.env.MONGODB_URI,
    // Variables publiques accessibles côté client
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
  },

  modules: [
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
})