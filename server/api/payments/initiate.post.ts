 
import { requireAuth } from '~/utils/jwt'
import { Transaction } from '../../models/transaction'
import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const { amount, productId, paymentMethod } = await readBody(event)

    if (!amount || !productId || !paymentMethod) {
      throw createError({
        statusCode: 400,
        message: 'Montant, produit et méthode de paiement requis'
      })
    }

    // Créer une nouvelle transaction
    const transaction = await Transaction.create({
      buyerId: user.userId,
      productId,
      amount,
      status: 'pending',
      paymentMethod
    })

    // Simuler l'initiation du paiement (à remplacer par l'intégration réelle)
    const paymentInitiation = {
      transactionId: transaction._id,
      paymentUrl: `/pay/${transaction._id}`,
      amount,
      currency: 'XOF'
    }

    return paymentInitiation
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de l\'initiation du paiement'
    })
  }
})
