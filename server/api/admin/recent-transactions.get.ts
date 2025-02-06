 
import { requireAuth } from '~/utils/jwt' 
import { Transaction } from '../../models/transaction' 
import {  createError,EventHandlerRequest, H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    
    if (user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Accès non autorisé'
      })
    }

    const recentTransactions = await Transaction.find()
      .populate('buyerId', 'fullName')
      .sort({ createdAt: -1 })
      .limit(5)

    return recentTransactions
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur serveur'
    })
  }
})