import { User } from '../../models/user'
import jwt from 'jsonwebtoken'
import { createError } from 'h3'
import bcrypt from 'bcryptjs'
import { connectDB } from '../../utils/db'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    
    const { email, password } = await readBody(event)

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email et mot de passe requis'
      })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Email ou mot de passe incorrect'
      })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: 'Email ou mot de passe incorrect'
      })
    }

    if (user.status !== 'active') {
      throw createError({
        statusCode: 403,
        message: 'Votre compte est inactif'
      })
    }

    const config = useRuntimeConfig()
    if (!config.jwtSecret) {
      logger.error('JWT_SECRET is not defined')
      throw createError({
        statusCode: 500,
        message: 'Erreur de configuration'
      })
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role || 'user',
        userType: user.userType
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const userResponse = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      userType: user.userType,
      role: user.role || 'user',
      status: user.status,
      avatarUrl: user.avatarUrl
    }

    return {
      token,
      user: userResponse
    }

  } catch (error: any) {
    logger.error('Login error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur interne du serveur'
    })
  }
})