// server/utils/jwt.ts    

import type { H3Event } from "h3";
import type { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { createError, useRuntimeConfig } from "nuxt/app";
import { createError as h3CreateError, getHeader } from "h3";

 

/**
 * AuthenticatedUser est une extension de JwtPayload qui inclut les informations de l'utilisateur.
 */
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
      throw h3CreateError({
        statusCode: 401,
        message: 'Token expired',
      } as { statusCode: number; message: string });
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw h3CreateError({
        statusCode: 401,
        message: 'Invalid token',
      } as { statusCode: number; message: string });
    }
    throw h3CreateError({
      statusCode: 500,
      message: 'Unexpected error verifying token',
    } as { statusCode: number; message: string });
  }
};

export const getUserFromEvent = (event: H3Event): AuthenticatedUser | null => { 
  const token = getHeader(event, 'authorization');
  if (!token || !token.toString().startsWith('Bearer ')) return null;

  const decoded = verifyToken(token.toString().replace('Bearer ', ''));
  return decoded;
};

export const isAuthenticated = (event: H3Event) => {
  const user = getUserFromEvent(event);
  return !!user;
};

export const requireAuth = async (event: H3Event): Promise<AuthenticatedUser> => {
  const user = getUserFromEvent(event);
  if (!user) {
    throw h3CreateError({
      statusCode: 401,
      message: 'Unauthorized',
    } as any);
  }
  return user;
};