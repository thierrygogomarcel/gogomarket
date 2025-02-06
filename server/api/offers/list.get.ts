import { createError, defineEventHandler, H3Event } from "h3"; 
import { getUserFromToken } from "~/server/utils/auth";   
import { Offer } from "~/server/models/Offer";
import { UserDocument } from "~/server/models/user";  

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Vérifier l'authentification
    const user: UserDocument = await getUserFromToken(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Non autorisé" });
    }

    // Récupérer les offres de l'utilisateur connecté
    const offers = await Offer.find({ userId: user._id }).sort({ createdAt: -1 });

    return { offers };
  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur serveur",
    });
  }
});
