import jwt, { JwtPayload } from 'jsonwebtoken'
import { H3Event, createError } from 'h3'

export interface AuthenticatedUser extends JwtPayload {
  userId: string
  email: string
  role: string
}

export const generateToken = (payload: object): string => {
  const config = useRuntimeConfig()
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  })
}

export const verifyToken = (token: string): AuthenticatedUser | null => {
  const config = useRuntimeConfig()
  try {
    return jwt.verify(token, config.jwtSecret) as AuthenticatedUser
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createError({
        statusCode: 401,
        message: 'Token expired'
      })
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw createError({
        statusCode: 401,
        message: 'Invalid token'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Error verifying token'
    })
  }
}

export const getUserFromEvent = (event: H3Event): AuthenticatedUser | null => {
  const token = event.headers.get('authorization')
  if (!token || !token.startsWith('Bearer ')) return null

  const decoded = verifyToken(token.replace('Bearer ', ''))
  return decoded
}

export const isAuthenticated = (event: H3Event) => {
  const user = getUserFromEvent(event)
  return !!user
}

export const requireAuth = async (event: H3Event): Promise<AuthenticatedUser> => {
  const user = getUserFromEvent(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  return user
}
