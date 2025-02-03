import { User } from '../../models/user';
import { createError } from 'h3';
import { requireAuth, AuthenticatedUser } from '~/utils/jwt';

export default defineEventHandler(async (event) => {
  try {
    const currentUser = await requireAuth(event) as AuthenticatedUser;
    const userId = event.context.params?.id;

    // Vérifier que l'utilisateur est un admin ou demande ses propres informations
    if (currentUser.role !== 'admin' && currentUser.userId !== userId) {
      throw createError({
        statusCode: 403,
        message: 'Not authorized to delete this user'
      });
    }

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required'
      });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      });
    }

    return {
      message: 'User deleted successfully'
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
});