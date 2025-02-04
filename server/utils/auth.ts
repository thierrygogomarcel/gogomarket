import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createError, H3Event } from 'h3'

// Function to hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Function to compare password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

// JWT payload interface
export interface JwtPayloadWithUserType {
  userId: string
  email: string
  role: string
  userType: 'producer' | 'buyer' | 'transport' | 'admin'
}

// Function to verify token
export const verifyToken = (token: string, config: any): JwtPayloadWithUserType => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayloadWithUserType
    return decoded
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Token invalide ou expiré'
    })
  }
}

// Function to get user from token
export const getUserFromToken = async (event: H3Event): Promise<JwtPayloadWithUserType | null> => {
  const authHeader = event.node.req.headers.authorization
 
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.replace('Bearer ', '')
  const config = useRuntimeConfig()
  console.log('[AUTH LOG] server utils\auth.ts loaded with authHeader:', token);
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
