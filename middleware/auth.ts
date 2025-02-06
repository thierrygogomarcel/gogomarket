import { defineEventHandler, getHeader } from 'h3'
import * as jwt from 'jsonwebtoken'
import { createError } from 'h3' 
import { logger } from 'nuxt/kit'
import { useRuntimeConfig } from '#imports'

// Add this interface to define the expected JWT payload structure
interface CustomJwtPayload extends jwt.JwtPayload {
  role?: string
  sub?: string
}

export default defineEventHandler(async (event) => {
  try {
    const token = getHeader(event, 'Authorization')?.split(' ')[1]

    if (!token) {
      logger.warn('Missing authentication token')
      throw createError({ statusCode: 401, message: 'Token manquant' })
    }

    const config = useRuntimeConfig()
    if (!config.jwtSecret) {
      logger.error('JWT Secret is not configured')
      throw createError({ statusCode: 500, message: 'Configuration error' })
    }
    const decoded = jwt.verify(token, config.jwtSecret as string) as CustomJwtPayload
    
    // Ajouter les informations de l'utilisateur au contexte
    event.context.user = decoded

    // Ajouter les headers en fonction du rôle
    if (decoded.role === 'admin') {
      event.node.res.setHeader('X-Admin-Access', 'true')
      event.node.res.setHeader('X-Admin-Permissions', 'full')
    }

    logger.info('User authenticated successfully', { userId: decoded.sub })
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Token expired')
      throw createError({ statusCode: 401, message: 'Token expiré' })
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid token')
      throw createError({ statusCode: 401, message: 'Token invalide' })
    }

    logger.error('Authentication error', { error })
    throw createError({ statusCode: 500, message: 'Erreur d\'authentification' })
  }
})