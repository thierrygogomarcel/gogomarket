// server/api/users/delete-all.ts
import { User } from '../../models/user';
import { Product } from '../../models/product';
import { createError } from 'h3';
import { getUserFromToken } from '../../utils/auth'; // Fonction pour extraire l'utilisateur du token


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