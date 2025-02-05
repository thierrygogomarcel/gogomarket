 
import { requireAuth } from '~/utils/jwt'
import { User } from '../../../models/user'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const currentUser = await requireAuth(event)
    
    // Vérifier que l'utilisateur est un admin
    if (currentUser.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Seuls les administrateurs peuvent modifier les rôles'
      })
    }

    const userId = event.context.params?.id
    const { role } = await readBody(event)

    if (!userId || !role) {
      throw createError({
        statusCode: 400,
        message: 'ID utilisateur et rôle requis'
      })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password')

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Utilisateur non trouvé'
      })
    }

    return user
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la modification du rôle'
    })
  }
})