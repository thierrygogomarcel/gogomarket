// server/utils/config.ts
import { defineNuxtConfig } from 'nuxt/config'

export function useServerConfig() {
  return {
    jwtSecret: process.env.JWT_SECRET || 'your-fallback-development-secret-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gogomarket',
  }
}
