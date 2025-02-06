// server/api/users/delete-all.ts
import { User } from '../../models/user';
import { Product } from '../../models/product';
import { createError, EventHandlerRequest, H3Event, getHeader, defineEventHandler } from 'h3'; 


export default defineEventHandler(async (event) => {
  try {
    const user = await getUserFromToken(event)

    // Vérifier que l'utilisateur est un admin
    if (!user || user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: "Accès refusé. Seul un administrateur peut effectuer cette action."
      })
    }

    // Supprimer tous les utilisateurs sauf l'admin
    await User.deleteMany({ role: { $ne: 'admin' } });
    
    // Supprimer tous les produits
    await Product.deleteMany({});

    return {
      message: 'Tous les utilisateurs (sauf admin) et produits ont été supprimés'
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur interne du serveur'
    });
  }
});

function getUserFromToken(event: H3Event<EventHandlerRequest>) {
  // TODO: Implement actual token validation logic
  // This is a placeholder implementation
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  // In a real implementation, you would:
  // 1. Verify the token's validity
  // 2. Decode the token
  // 3. Fetch the user from the database
  // For now, return a mock admin user
  return {
    role: 'admin'
  };
}
