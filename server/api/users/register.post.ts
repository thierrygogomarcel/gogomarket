 
import { User } from '../../models/user'
import { createError } from 'h3'
 
import { validateData, registerSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Valider les données
    const validatedData = validateData(registerSchema, body)

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email: validatedData.email })
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Cet email est déjà utilisé'
      })
    }

    // Créer l'utilisateur
    const user = await User.create({
      ...validatedData,
      password: await hashPassword(validatedData.password),
      status: 'active'
    })

    return {
      message: 'Inscription réussie',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de l\'inscription'
    })
  }
}) 

function hashPassword(password: string) {
  throw new Error('Function not implemented.')
}
