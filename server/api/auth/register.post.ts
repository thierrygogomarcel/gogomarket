import { User } from '../../models/user'
import { createError, defineEventHandler, readBody } from 'h3' 
import jwt from 'jsonwebtoken'
import { useRuntimeConfig } from 'nuxt/app'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, fullName, phone, userType, entityType } = body

    // Validation des champs requis
    if (!email || !password || !fullName || !phone || !userType || !entityType) {
      throw createError({
        statusCode: 400,
        message: 'Tous les champs sont requis'
      })
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Cet email est déjà utilisé'
      })
    }

    // Hasher le mot de passe
    //const hashedPassword = await hashPassword(password)

    // Créer l'utilisateur
    const user = await User.create({
      email,
      password: password,
      fullName,
      phone,
      userType,
      entityType,
      role: userType,
      status: 'active'
    })

    // Générer le token JWT
    const config = useRuntimeConfig()
    
    // Validate JWT configuration
    if (!config.jwtSecret) {
      throw createError({
        statusCode: 500,
        message: 'JWT Secret is not configured'
      })
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role,
        userType: user.userType
      },
      config.jwtSecret as string,
      { 
        expiresIn: '1d' // Token expires in 1 day
      }
    )

    return {
      message: 'Inscription réussie',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        entityType: user.entityType,
        role: user.role
      },
      token
    }
  } catch (error: any) {
    console.error('Erreur d\'inscription:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de l\'inscription'
    })
  }
})