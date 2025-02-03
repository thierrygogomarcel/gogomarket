// server/middleware/auth.ts  
import jwt from 'jsonwebtoken'
import { createError, eventHandler, getRequestHeader } from 'h3'

export default eventHandler(async (event) => {
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/api/auth/login',
    '/api/auth/register',
    '/connexion',
    '/inscription',
    '/explorer'
  ]

  // Skip auth check for public routes
  if (publicRoutes.some(route => event.path.startsWith(route))) {
    return
  }

  try {
    const config = useRuntimeConfig()
    const authHeader = getRequestHeader(event, 'Authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'No token provided'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, config.jwtSecret)

    // Add user info to event context
    event.context.auth = decoded

    return decoded
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      message: error.message || 'Invalid or expired token'
    })
  }
})