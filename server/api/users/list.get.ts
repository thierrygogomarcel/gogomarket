import { User } from '../../models/user';
import { createError } from 'h3';
import { requireAuth } from '~/utils/jwt';

export default defineEventHandler(async (event) => {
  try {
    const currentUser = await requireAuth(event);

    // Vérifier que l'utilisateur est un admin
    if (currentUser.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Only administrators can list users'
      });
    }

    const query = getQuery(event);
    const {
      userType,
      status,
      search,
      page = 1,
      limit = 10
    } = query;

    const filter: any = {};

    if (userType) filter.userType = userType;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    return {
      users,
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