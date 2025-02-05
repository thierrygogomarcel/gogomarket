// server/api/users/stats.get.ts

import { requireAuth } from '~/utils/jwt'
import { Product } from '../../models/product'
import { Transaction } from '../../models/transaction'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)

    const stats: any = {}

    if (user.userType === 'producer') {
      stats.productsCount = await Product.countDocuments({ sellerId: user.userId })
      stats.salesCount = await Transaction.countDocuments({ sellerId: user.userId, status: 'completed' })
    } else if (user.userType === 'buyer') {
      stats.purchasesCount = await Transaction.countDocuments({ buyerId: user.userId, status: 'completed' })
    }

    return stats
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error fetching user stats'
    })
  }
})
