import { H3Event, createError } from 'h3'
import { useRuntimeConfig } from '../utils/config'
import { User } from '../models/user'
import jwt from 'jsonwebtoken'

// Function to hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Function to get user from token
export const getUserFromToken = async (event: H3Event): Promise<JwtPayloadWithUserType | null> => {
  const authHeader = event.node.req.headers.authorization
 
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.replace('Bearer ', '')
  const config = useRuntimeConfig()
  return verifyToken(token, config)
}
  
// Auth middleware
export const requireAuth = async (event: H3Event): Promise<JwtPayloadWithUserType> => {
  const user = await getUserFromToken(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Token manquant ou invalide'
    })
  }
  return user
}