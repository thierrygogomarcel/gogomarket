import { Product } from '../../models/product';
import { createError, defineEventHandler, readBody } from 'h3';
import { requireAuth, AuthenticatedUser } from '~/utils/jwt'; 

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event) as AuthenticatedUser;
    const productId = event.context.params?.id;
    const updates = await readBody(event);

    if (!productId) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (product.sellerId.toString() !== user.userId) {
      throw createError({
        statusCode: 403,
        message: 'Not authorized to update this product'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updates },
      { new: true }
    );

    return updatedProduct;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
});