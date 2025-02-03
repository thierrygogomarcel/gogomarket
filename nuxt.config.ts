import { defineNuxtConfig } from 'nuxt/config'
 

export default defineNuxtConfig({
  ssr: true,

  nitro: {
    preset: 'node',
  },

  devServer: {
    port: 3001,
    host: '0.0.0.0'
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

  app: {
    head: {
      title: 'GoGoMarket',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Plateforme de mise en relation entre producteurs et acheteurs de produits agricoles' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' }
      ]
    }
  },
//@ts-ignore
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: ''
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    mongodbUri: process.env.MONGODB_URI,
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000'
    }
  },

  build: {
    transpile: ['vue3-toastify']
  },

  devtools: {
    enabled: process.env.NODE_ENV !== 'production'
  },

  serverMiddleware: [
    { path: '/api', handler: '~/server/api' }
  ],

  hooks: {
    'pages:extend'(pages) {
      pages.push(
        {
          name: 'favorites',
          path: '/favoris',
          file: '~/pages/favoris.vue'
        },
        {
          name: 'users',
          path: '/users',
          file: '~/pages/admin/utilisateurs.vue'
        }
      )
    }
  },

  compatibilityDate: '2025-01-30'
})
