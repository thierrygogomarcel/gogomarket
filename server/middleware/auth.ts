// server/middleware/auth.ts
import { defineEventHandler, getHeader } from 'h3';
import * as jwt from 'jsonwebtoken';
import { createError } from 'h3';
import { useRuntimeConfig } from 'nuxt/app';  

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.split(' ')[1];

  if (!token) {
    throw createError({ statusCode: 401, message: 'Token manquant' });
  }

  // Use runtime config to get JWT secret
  const config = useRuntimeConfig();
  const secret = config.jwtSecret;

  if (!secret) {
    throw createError({ statusCode: 500, message: 'JWT Secret is not configured' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    event.context.user = decoded;
  } catch (error) {
    throw createError({ statusCode: 401, message: 'Token invalide' });
  }
});