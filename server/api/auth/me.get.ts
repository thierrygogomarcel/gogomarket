 
import { User } from '../../models/user'
import { createError, EventHandlerRequest, H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    
    const userDoc = await User.findById(user.userId).select('-password')
    if (!userDoc) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    return userDoc
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
})

function requireAuth(event: H3Event<EventHandlerRequest>) {
  throw new Error('Function not implemented.')
}
