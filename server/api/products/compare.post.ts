import { Product } from '../../models/product'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const { productIds } = await readBody(event)

    if (!Array.isArray(productIds) || productIds.length < 2) {
      throw createError({
        statusCode: 400,
        message: 'Au moins deux produits sont requis pour la comparaison'
      })
    }

    const products = await Product.find({
      _id: { $in: productIds }
    }).populate('sellerId', 'fullName location rating')

    // Structurer la comparaison
    const comparison = {
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        price: p.price,
        category: p.category,
        location: p.location,
        seller: p.sellerId,
        stock: p.stock,
        rating: p.rating
      })),
      differences: {
        price: {
          min: Math.min(...products.map(p => p.price)),
          max: Math.max(...products.map(p => p.price)),
          difference: Math.max(...products.map(p => p.price)) - Math.min(...products.map(p => p.price))
        }
      }
    }

    return comparison
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la comparaison des produits'
    })
  }
})