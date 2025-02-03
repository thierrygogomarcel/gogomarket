import { requireAuth } from '../../utils/auth'
import { Favorite } from '../../models/favorite'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const productId = event.context.params?.id

    if (!productId) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required'
      })
    }

    await Favorite.findOneAndDelete({
      userId: user.userId,
      productId
    })

    return {
      message: 'Favorite removed successfully'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
})