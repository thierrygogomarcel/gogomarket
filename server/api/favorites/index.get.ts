 import { Favorite } from '../../models/favorite'
import { createError, EventHandlerRequest, H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user

    // Add a type guard to check if user exists
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized: User not found'
      })
    }

    const favorites = await Favorite.find({ userId: user.userId })
      .populate('productId')
      .sort({ createdAt: -1 })

    return {
      favorites: favorites.map(f => f.productId)
    }
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

function defineEventHandler(arg0: (event: any) => Promise<{ favorites: any[] }>) {
  throw new Error('Function not implemented.')
}
