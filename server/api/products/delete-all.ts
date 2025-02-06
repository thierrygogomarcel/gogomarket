import { Product } from '../../models/product'
import { createError } from 'h3'
import { requireAuth } from '~/utils/jwt'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)

    // Vérifier que l'utilisateur est un admin
    if (user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Only administrators can delete all products'
      })
    }

    // Supprimer tous les produits
    const result = await Product.deleteMany({})
    
    return {
      message: `${result.deletedCount} products deleted successfully`
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
