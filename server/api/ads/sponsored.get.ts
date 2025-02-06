import { Product } from '../../models/product'
import { createError, defineEventHandler, getQuery, H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const { category, location } = getQuery(event)

    const filter: any = {
      sponsored: true
    }

    if (category) filter.category = category
    if (location) filter.location = location

    const sponsoredProducts = await Product.find(filter)
      .populate('sellerId', 'fullName location rating')
      .sort({ sponsoredRank: -1 })
      .limit(5)

    return {
      products: sponsoredProducts,
      total: sponsoredProducts.length
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la récupération des annonces sponsorisées'
    })
  }
})