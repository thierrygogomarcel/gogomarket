// server/api/users/[id].put.ts 

import { User } from "~/server/models/user";

export default defineEventHandler(async (event) => {
  // Add null check for event.context.params
  if (!event.context.params || !event.context.params.id) {
    throw createError({ 
      statusCode: 400, 
      message: 'User ID is required' 
    });
  }
  
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

function hashPassword(password: any): any {
  throw new Error("Function not implemented.");
}
