import { User } from '../../models/user';
import * as jwt from 'jsonwebtoken';
import { createError, defineEventHandler } from 'h3';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../utils/db';
import { logger } from '../../utils/logger';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    logger.info('Connexion à la base de données réussie');

    const { email, password } = await readBody(event);
    logger.info(`Tentative de connexion pour l'email: ${email}`);

    if (!email || !password) {
      logger.warn('Email ou mot de passe manquant');
      throw createError({
        statusCode: 400,
        message: 'Email et mot de passe requis',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      logger.warn(`Utilisateur non trouvé pour l'email: ${email}`);
      throw createError({
        statusCode: 401,
        message: 'Email ou mot de passe incorrect',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logger.warn('Mot de passe incorrect');
      throw createError({
        statusCode: 401,
        message: 'Email ou mot de passe incorrect',
      });
    }

    if (user.status !== 'active') {
      logger.warn(`Compte inactif pour l'utilisateur: ${user.email}`);
      throw createError({
        statusCode: 403,
        message: 'Votre compte est inactif',
      });
    }

    const config = useRuntimeConfig();
    if (!config.jwtSecret) {
      logger.error('JWT_SECRET non défini');
      throw createError({
        statusCode: 500,
        message: 'Erreur de configuration',
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role || 'user',
        userType: user.userType,
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
    logger.info(`Token généré pour l'utilisateur: ${user.email}`);

    const userResponse = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      userType: user.userType,
      role: user.role || 'user',
      status: user.status,
      avatarUrl: user.avatarUrl,
    };

    return {
      token: token, 
      user: userResponse,
    };
  } catch (error: any) {
    logger.error('Erreur lors de la connexion:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur interne du serveur',
    });
  }
});