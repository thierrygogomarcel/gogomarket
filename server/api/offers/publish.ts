import { H3Event } from "h3";
import { z } from "zod";
import mongoose from 'mongoose';
import { getUserFromToken } from "../../utils/auth";
import { Offer } from "../../models/Offer";
import { Product } from '../../models/product';
import { logger } from "../../utils/logger";

// Input validation schema
const PublishOfferSchema = z.object({
  productId: z.string().trim().min(1, "Product ID is required"),
  message: z.string().trim().min(10, "Message must be at least 10 characters long").max(500, "Message cannot exceed 500 characters")
});

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Authenticate user
    const user = await getUserFromToken(event);
    if (!user) {
      logger.warn("Unauthorized offer publication attempt");
      throw createError({ 
        statusCode: 401, 
        message: "Vous devez être connecté pour publier une offre" 
      });
    }

    // Parse and validate input
    const body = await readBody(event);
    console.log('Received offer data:', body); // Debug logging

    const validationResult = PublishOfferSchema.safeParse(body);

    if (!validationResult.success) {
      logger.error("Invalid offer data", { 
        errors: validationResult.error.errors, 
        body 
      });
      throw createError({ 
        statusCode: 400, 
        message: validationResult.error.errors[0].message 
      });
    }

    const { productId, message } = validationResult.data;

    // Convert productId to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Verify product ownership and existence
    const product = await Product.findOne({ 
      _id: productObjectId, 
      userId: new mongoose.Types.ObjectId(user._id) 
    });

    if (!product) {
      logger.warn(`Product not found or not owned by user`, { 
        productId, 
        userId: user._id 
      });
      throw createError({ 
        statusCode: 404, 
        message: "Produit non trouvé ou non autorisé" 
      });
    }

    // Check for existing offer
    const existingOffer = await Offer.findOne({ productId: productObjectId, userId: user._id });
    if (existingOffer) {
      logger.warn("Duplicate offer creation attempt", { 
        productId, 
        userId: user._id 
      });
      throw createError({ 
        statusCode: 409, 
        message: "Une offre existe déjà pour ce produit" 
      });
    }

    // Create new offer
    const newOffer = new Offer({
      userId: user.userId,  
      productId: productObjectId,
      message,
      status: "publié",
      createdAt: new Date()
    });

    await newOffer.save();

    logger.info('Offer published successfully', { 
      offerId: newOffer._id, 
      productId, 
      userId: user._id 
    });

    return { 
      success: true, 
      message: "Offre publiée avec succès", 
      offer: newOffer 
    };

  } catch (error: any) {
    logger.error('Error in offer publication', { 
      error: error.message, 
      stack: error.stack 
    });

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la publication de l\'offre'
    });
  }
});