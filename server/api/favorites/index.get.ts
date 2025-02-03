import { requireAuth } from '../../utils/auth'
import { Favorite } from '../../models/favorite'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)

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