
// server/api/users/[id].put.ts
import { hashPassword } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const body = await readBody(event);
  try {
    if (body.password) {
      body.password = await hashPassword(body.password);
    }
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true }).select('-password');
    if (!updatedUser) {
      throw createError({ statusCode: 404, message: 'Utilisateur non trouvé' });
    }
    return updatedUser;
  } catch (error: any) {
    throw createError({ statusCode: error.statusCode || 500, message: error.message });
  }
});