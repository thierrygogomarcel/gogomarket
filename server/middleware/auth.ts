// server/middleware/auth.ts
import { createError, defineEventHandler, getHeader } from 'h3'
import jwt from 'jsonwebtoken'
import { getServerConfig } from '../utils/config'

// Define user type with userId
interface UserToken {
  userId: string
  [key: string]: any  // Allow additional properties
}

export { UserToken }

export default defineEventHandler(async (event) => {
  const config = getServerConfig()
  const token = getHeader(event, 'Authorization')?.split(' ')[1]

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Token manquant'
    })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as UserToken
    event.context.user = decoded
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Token invalide'
    })
  }
})
