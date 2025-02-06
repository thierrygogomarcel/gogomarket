import { Product } from '../../models/product';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const productId = event.context.params?.id;

    if (!productId) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required'
      });
    }

    const product = await Product.findById(productId)
      .populate('sellerId', 'fullName location createdAt');

    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found'
      });
    }

    return product;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
});

function defineEventHandler(arg0: (event: any) => Promise<any>) {
  throw new Error('Function not implemented.');
}
