 import { User, UserDocument } from '../../models/user'
import { Product } from '../../models/product'
import { createError, defineEventHandler, EventHandlerRequest, H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
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

function requireAuth(event: H3Event<EventHandlerRequest>): UserDocument {
  const user = event.context.user as unknown as UserDocument
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Non authentifié'
    })
  }
  return user
}
function readBody(event: H3Event<EventHandlerRequest>): { productId: any; duration: any; budget: any } | PromiseLike<{ productId: any; duration: any; budget: any }> {
  throw new Error('Function not implemented.')
}

