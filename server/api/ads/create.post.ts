 
import { Product } from '../../models/product'
import { createError, EventHandlerRequest, H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const { productId, duration, budget } = await readBody(event)

    if (!productId || !duration || !budget) {
      throw createError({
        statusCode: 400,
        message: 'ID produit, durée et budget requis'
      })
    }

    const product = await Product.findById(productId)
    
    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Produit non trouvé'
      })
    }

    // Vérifier que l'utilisateur est le propriétaire du produit
    if (product.sellerId.toString() !== user.userId) {
      throw createError({
        statusCode: 403,
        message: 'Non autorisé à sponsoriser ce produit'
      })
    }

    // Mettre à jour le produit avec les informations de sponsoring
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        sponsored: true,
        sponsoredUntil: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
        sponsoredBudget: budget,
        sponsoredRank: Math.floor(budget / duration) // Calcul simple du rang basé sur le budget quotidien
      },
      { new: true }
    )

    return updatedProduct
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la création de l\'annonce sponsorisée'
    })
  }
})

function requireAuth(event: H3Event<EventHandlerRequest>) {
  throw new Error('Function not implemented.')
}
