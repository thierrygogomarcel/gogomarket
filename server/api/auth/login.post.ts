import { User } from '../../models/user'
import * as jwt from 'jsonwebtoken'
import { createError, defineEventHandler, readBody } from 'h3'
import bcrypt from 'bcryptjs'
import { connectDB } from '../../utils/db' 
import { useRuntimeConfig } from 'nuxt/app'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    console.log('Connexion à la base de données réussie')

    const { email, password } = await readBody(event)
    console.log(`Tentative de connexion pour l'email: ${email}`)

    if (!email || !password) {
      console.warn('Email ou mot de passe manquant')
      throw createError({
        statusCode: 400,
        message: 'Email et mot de passe requis',
      })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      console.warn(`Utilisateur non trouvé pour l'email: ${email}`)
      throw createError({
        statusCode: 401,
        message: 'Email ou mot de passe incorrect',
      })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      console.warn('Mot de passe incorrect')
      throw createError({
        statusCode: 401,
        message: 'Email ou mot de passe incorrect',
      })
    }

    if (user.status !== 'active') {
      console.warn(`Compte inactif pour l'utilisateur: ${user.email}`)
      throw createError({
        statusCode: 403,
        message: 'Votre compte est inactif',
      })
    }

    const config = useRuntimeConfig()
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        userType: user.userType,
      },
      config.jwtSecret as string,
      { expiresIn: '7d' }
    )

    // Définir les headers en fonction du rôle
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }

    if (user.role === 'admin') {
      Object.assign(headers, {
        'X-Admin-Access': 'true',
        'X-Admin-Permissions': 'full'
      })
    }

    event.node.res.setHeader('Set-Cookie', `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`)
    
    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        role: user.role,
        status: user.status,
        avatarUrl: user.avatarUrl,
      },
      headers
    }
  } catch (error: any) {
    console.error('Erreur lors de la connexion:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur interne du serveur',
    })
  }
})