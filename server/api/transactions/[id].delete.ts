 import { Transaction } from '../../models/transaction'
import { createError, EventHandlerRequest, H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const id = event.context.params?.id

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Transaction ID is required'
      })
    }

    const transaction = await Transaction.findById(id)
    if (!transaction) {
      throw createError({
        statusCode: 404,
        message: 'Transaction not found'
      })
    }

    // Only admin or transaction participants can delete
    if (user.role !== 'admin' && 
        transaction.buyerId.toString() !== user.userId &&
        transaction.sellerId.toString() !== user.userId) {
      throw createError({
        statusCode: 403,
        message: 'Not authorized to delete this transaction'
      })
    }

    await Transaction.findByIdAndDelete(id)

    return {
      message: 'Transaction deleted successfully'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
})

function requireAuth(event: H3Event<EventHandlerRequest>) {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  return user
}

function defineEventHandler(arg0: (event: any) => Promise<{ message: string }>) {
  throw new Error('Function not implemented.')
}
