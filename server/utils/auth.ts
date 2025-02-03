import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createError, H3Event } from 'h3'

// Fonction pour hasher un mot de passe
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Fonction pour comparer un mot de passe
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

// Fonction pour générer un token JWT
export const generateToken = (payload: object, config: any): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  })
}

// Fonction pour vérifier un token JWT
export const verifyToken = (token: string, config: any) => {
  try {
    return jwt.verify(token, config.jwtSecret)
  } catch (error) {
    return null
  }
}

// Define an interface for JWT payload
export interface JwtPayloadWithUserType {
  role: string
  userType: 'producer' | 'consumer' | 'admin'
  userId: string
  // Add other properties as needed
}

// Fonction pour extraire l'utilisateur à partir d'un token
export const getUserFromToken = async (event: H3Event): Promise<JwtPayloadWithUserType | null> => {
  try {
    const token = event.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return null
    }

    const config = useRuntimeConfig(event)
    const decoded = verifyToken(token, config)

    if (!decoded) {
      return null
    }

    return decoded as JwtPayloadWithUserType
  } catch (error) {
    return null
  }
}

// Middleware d'authentification
export const requireAuth = async (event: H3Event): Promise<JwtPayloadWithUserType> => {
  const token = event.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Token manquant'
    })
  }

  // Récupérer la configuration runtime dans la fonction
  const config = useRuntimeConfig()
  
  const decoded = verifyToken(token, config)
  if (!decoded || typeof decoded === 'string') {
    throw createError({
      statusCode: 401,
      message: 'Token invalide'
    })
  }

  // Type assertion to ensure decoded has userType
  return decoded as JwtPayloadWithUserType
}
