import { requireAuth } from '../../utils/auth'
import { Transaction } from '../../models/transaction'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const query = getQuery(event)
    const { role } = query

    const filter: any = {}
    
    // Filter transactions based on user role
    if (role === 'buyer') {
      filter.buyerId = user.userId
    } else if (role === 'producer') {
      filter.sellerId = user.userId
    } else if (user.role !== 'admin') {
      // If no role specified and not admin, show user's transactions
      filter.$or = [{ buyerId: user.userId }, { sellerId: user.userId }]
    }

    const transactions = await Transaction.find(filter)
      .populate('buyerId', 'fullName email')
      .populate('sellerId', 'fullName email')
      .populate('productId')
      .sort({ createdAt: -1 })

    return transactions
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
})