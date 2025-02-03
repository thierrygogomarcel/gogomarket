import { z } from 'zod'

// Schéma de validation pour l'inscription
export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  fullName: z.string().min(2, 'Le nom complet est requis'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  userType: z.enum(['producer', 'buyer'])
})

// Schéma de validation pour la connexion
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe invalide')
})

// Schéma de validation pour les produits
export const productSchema = z.object({
  name: z.string().min(2, 'Le nom du produit est requis'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  price: z.number().min(0, 'Le prix doit être positif'),
  category: z.string(),
  location: z.string(),
  stock: z.number().min(0, 'Le stock doit être positif'),
  images: z.array(z.string()).optional()
})

// Fonction utilitaire pour valider les données
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data)
}