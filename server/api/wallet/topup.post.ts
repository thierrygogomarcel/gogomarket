 
import { requireAuth } from '../../utils/auth'
import { User } from '../../models/user'
import { Transaction } from '../../models/transaction'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const { amount, paymentMethod } = await readBody(event)

    if (!amount || amount < 500) {
      throw createError({
        statusCode: 400,
        message: 'Montant minimum de 500 FCFA requis'
      })
    }

    // Créer une transaction de rechargement
    const transaction = await Transaction.create({
      userId: user.userId,
      type: 'topup',
      amount,
      status: 'pending',
      paymentMethod
    })

    // Simuler le processus de paiement (à remplacer par l'intégration réelle)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mettre à jour la transaction et le solde de l'utilisateur
    await Promise.all([
      Transaction.findByIdAndUpdate(transaction._id, { status: 'completed' }),
      User.findByIdAndUpdate(user.userId, { $inc: { balance: amount } })
    ])

    return {
      message: 'Rechargement effectué avec succès',
      transactionId: transaction._id
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors du rechargement'
    })
  }
}) 