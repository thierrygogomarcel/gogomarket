import { defineEventHandler, getHeader } from 'h3'
import * as jwt from 'jsonwebtoken'
import { createError } from 'h3'
import { useRuntimeConfig } from 'nuxt/app' 

// Définition d'un middleware pour gérer l'authentification JWT
export default defineEventHandler(async (event) => {
  // Récupération du token dans l'en-tête Authorization
  const token = getHeader(event, 'Authorization')?.split(' ')[1] // Format attendu : "Bearer <token>"

  // Vérification si un token est bien présent
  if (!token) {
    console.warn('Accès refusé: Aucun token fourni')
    throw createError({ statusCode: 401, message: 'Token manquant' }) // Erreur 401: Non autorisé
  }

  // Récupération de la configuration de l'application (ex: variables d'environnement)
  const config = useRuntimeConfig()
  const secret = config.jwtSecret // Clé secrète pour valider le token

  // Vérification si la clé secrète est bien définie et est une chaîne
  if (!secret || typeof secret !== 'string') {
    console.error('Erreur de configuration: JWT_SECRET est manquant ou invalide')
    throw createError({ statusCode: 500, message: 'Configuration error: Invalid JWT secret' }) // Erreur 500: Problème interne
  }

  try {
    // Vérification et décodage du token avec la clé secrète
    const decoded = jwt.verify(token, secret as string)
    
    // Ajout des informations de l'utilisateur décodé dans le contexte de l'événement
    event.context.user = decoded

    console.log('Authentification réussie pour l\'utilisateur:', decoded)
  } catch (error) {
    console.error('Échec de la vérification du token:', error)
    throw createError({ statusCode: 401, message: 'Token invalide' }) // Erreur 401: Token invalide
  }
})
