import jwt, { type JwtPayload, type SignOptions, type Secret } from 'jsonwebtoken';
import { H3Event, createError } from 'h3'; 
import { useRuntimeConfig } from 'nuxt/kit';


export interface AuthenticatedUser extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: object, options?: SignOptions): string => {
  const config = useRuntimeConfig();
  const secret = config.jwtSecret as Secret; // Assurez-vous que le secret est de type `Secret`

  if (!secret) {
    throw new Error('JWT secret is not defined');
  }

  // Assurez-vous que `expiresIn` est de type `string | number`
  const expiresIn = config.jwtExpiresIn || '1h';

  return jwt.sign(payload, secret, {
    expiresIn, // Utilisez `expiresIn` directement
    ...(options || {}), // Fusionnez les options supplémentaires
  });
};

export const verifyToken = (token: string): AuthenticatedUser | null => {
  const config = useRuntimeConfig();
  const secret = config.jwtSecret as Secret; // Assurez-vous que le secret est de type `Secret`

  try {
    return jwt.verify(token, secret) as AuthenticatedUser;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createError({
        statusCode: 401,
        message: 'Token expired',
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw createError({
        statusCode: 401,
        message: 'Invalid token',
      });
    }
    throw createError({
      statusCode: 500,
      message: 'Error verifying token',
    });
  }
};

export const getUserFromEvent = (event: H3Event): AuthenticatedUser | null => {
  const token = event.headers.get('authorization');
  if (!token || !token.startsWith('Bearer ')) return null;

  const decoded = verifyToken(token.replace('Bearer ', ''));
  return decoded;
};

export const isAuthenticated = (event: H3Event) => {
  const user = getUserFromEvent(event);
  return !!user;
};

export const requireAuth = async (event: H3Event): Promise<AuthenticatedUser> => {
  const user = getUserFromEvent(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
  return user;
};