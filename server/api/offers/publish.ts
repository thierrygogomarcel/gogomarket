import { H3Event } from "h3";
import { getUserFromToken } from "~/server/utils/auth";
import { Offer } from "~/server/models/Offer";
import { Product } from '../../models/product';

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Vérifier l'authentification
    const user = await getUserFromToken(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Non autorisé" });
    }

    // Récupérer les données du corps de la requête
    const body = await readBody(event);
    const { productId, message } = body;

    if (!productId || !message) {
      throw createError({ statusCode: 400, statusMessage: "Données invalides" });
    }

    // Vérifier si le produit existe et appartient à l'utilisateur
    const product = await Product.findOne({ _id: productId, userId: user._id });

    if (!product) {
      throw createError({ statusCode: 404, statusMessage: "Produit introuvable ou non autorisé" });
    }

    // Vérifier si une offre existe déjà pour ce produit
    const existingOffer = await Offer.findOne({ productId, userId: user._id });
    if (existingOffer) {
      throw createError({ statusCode: 400, statusMessage: "Une offre existe déjà pour ce produit" });
    }

    // Créer une nouvelle offre
    const newOffer = new Offer({
      userId: user._id,
      productId,
      message,
      status: "publié",
    });

    await newOffer.save();

    return { success: true, message: "Offre publiée avec succès", offer: newOffer };
  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur serveur",
    });
  }
});
