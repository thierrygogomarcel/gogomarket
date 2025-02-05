 
import { requireAuth } from '~/utils/jwt'
import { User } from '../../models/user'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    
    const profile = await User.findById(user.userId).select('-password')
    if (!profile) {
      throw createError({
        statusCode: 404,
        message: 'Profile not found'
      })
    }

    return profile
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
})