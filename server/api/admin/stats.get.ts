// server/api/admin/stats.get.ts
import { requireAuth } from '../../utils/auth'
import { User } from '../../models/user'
import { Product } from '../../models/product'
import { Transaction } from '../../models/transaction'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)

    // Vérifier que l'utilisateur est un admin
    if (user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Accès non autorisé'
      })
    }

    // Récupérer les statistiques
    const [usersCount, productsCount, transactions] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Transaction.find({ status: 'completed' })
    ])

    // Calculer le chiffre d'affaires total
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)

    return {
      usersCount,
      productsCount,
      transactionsCount: transactions.length,
      totalRevenue
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la récupération des statistiques'
    })
  }
})
