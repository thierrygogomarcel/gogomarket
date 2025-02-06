 import { User, UserDocument } from '../../models/user'
import { Product } from '../../models/product'
import { Transaction } from '../../models/transaction'
import { createError, EventHandlerRequest, H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    
    if (user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Accès non autorisé'
      })
    }

    const [totalUsers, totalProducts, transactions] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Transaction.find({ status: 'completed' })
    ])

    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0)

    return {
      totalUsers,
      totalProducts,
      totalTransactions: transactions.length,
      totalRevenue
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur serveur'
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
