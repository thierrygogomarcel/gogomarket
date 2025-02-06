 
import { requireAuth } from  '../~/utils/jwt'
import { Transaction } from '../../../models/transaction'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const transactionId = event.context.params?.transaction_id

    if (!transactionId) {
      throw createError({
        statusCode: 400,
        message: 'ID de transaction requis'
      })
    }

    const transaction = await Transaction.findById(transactionId)
      .populate('productId')
      .populate('buyerId', 'fullName email')

    if (!transaction) {
      throw createError({
        statusCode: 404,
        message: 'Transaction non trouvée'
      })
    }

    // Vérifier que l'utilisateur est autorisé à voir cette transaction
    if (transaction.buyerId.toString() !== user.userId && user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Non autorisé à voir cette transaction'
      })
    }

    return transaction
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la récupération du statut'
    })
  }
})