import { Sale } from '../../models/sale';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { sellerId, buyerId, page = 1, limit = 10 } = query;

    const filter: any = {};
    if (sellerId) filter.sellerId = sellerId;
    if (buyerId) filter.buyerId = buyerId;

    const skip = (Number(page) - 1) * Number(limit);

    const sales = await Sale.find(filter)
      .populate('productId', 'name price images')
      .populate('buyerId', 'fullName email')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Sale.countDocuments(filter);

    return {
      sales,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    };
  } catch (error: any) {
    console.error('Erreur API /api/sales/list:', error); // 🔍 Log de l'erreur
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
});
