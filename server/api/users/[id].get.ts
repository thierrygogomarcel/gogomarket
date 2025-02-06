import { User } from '../../models/user';
import { createError } from 'h3';
import { requireAuth } from '~/utils/jwt';

export default defineEventHandler(async (event) => {
  try {
    const currentUser = await requireAuth(event);
    const userId = event.context.params?.id;

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required'
      });
    }

    // Vérifier que l'utilisateur est un admin ou demande ses propres informations
    if (currentUser.role !== 'admin' && currentUser.userId !== userId) {
      throw createError({
        statusCode: 403,
        message: 'Not authorized to access this user information'
      });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      });
    }

    return user;
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
