import { User } from '../../models/user'
import jwt from 'jsonwebtoken'
import { createError } from 'h3'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email })
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Email ou mot de passe incorrect'
      })
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: 'Email ou mot de passe incorrect'
      })
    }

    // Vérifier le statut de l'utilisateur
    if (user.status !== 'active') {
      throw createError({
        statusCode: 403,
        message: 'Votre compte est inactif'
      })
    }

    // Récupérer la configuration
    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret

    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined')
      throw createError({
        statusCode: 500,
        message: 'Configuration error'
      })
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role || 'user',
        userType: user.userType
      },
      jwtSecret,
      { expiresIn: '7d' }
    )

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        role: user.role || 'user',
        status: user.status,
        avatarUrl: user.avatarUrl
      }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur interne du serveur'
    })
  }
})
