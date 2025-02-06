import { Product } from '../../models/product'
import { createError, EventHandlerRequest, H3Event } from 'h3' 
import { requireAuth } from '~/utils/jwt'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const user = await requireAuth(event)
    const productId = event.context.params?.id

    if (!productId) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required'
      })
    }

    const product = await Product.findById(productId)
    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found'
      })
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (product.sellerId.toString() !== user.userId && user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Not authorized to delete this product'
      })
    }

    await Product.findByIdAndDelete(productId)

    return {
      message: 'Product deleted successfully'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
})

function defineEventHandler(arg0: (event: any) => Promise<{ message: string }>) {
  throw new Error('Function not implemented.')
}
