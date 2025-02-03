import { Product } from '../../models/product';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const {
      category,
      location,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10
    } = query;

    const filter: any = {};

    if (category) filter.category = category;
    if (location) filter.location = location;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .populate('sellerId', 'fullName location')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    return {
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
});