 import { User, UserDocument } from '../../models/user'
import { createError, EventHandlerRequest, H3Event } from 'h3'
import { getCookie } from 'h3'

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
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des utilisateurs récents'
    })
  }
})

async function requireAuth(event: H3Event<EventHandlerRequest>): Promise<UserDocument> {
  // Récupérer l'utilisateur authentifié depuis la session ou le token
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Non authentifié'
    })
  }

  // Trouver l'utilisateur avec le token
  const user = await User.findOne({ token })

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Utilisateur non trouvé'
    })
  }

  return user
}
