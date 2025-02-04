import { requireAuth } from '../../utils/auth'
import { User } from '../../models/user'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    
    // Vérifier que l'utilisateur est un admin
    if (user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Accès non autorisé'
      })
    }

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5)

    return recentUsers
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur serveur'
    })
  }
})