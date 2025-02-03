import { requireAuth } from '../../utils/auth'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event)

    const roles = [
      {
        id: 'admin',
        name: 'Administrateur',
        permissions: ['all']
      },
      {
        id: 'producer',
        name: 'Producteur',
        permissions: ['create_product', 'edit_product', 'delete_product']
      },
      {
        id: 'buyer',
        name: 'Acheteur',
        permissions: ['view_product', 'create_order']
      },
      {
        id: 'transport',
        name: 'Transporteur',
        permissions: ['view_delivery', 'update_delivery']
      }
    ]

    return roles
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la récupération des rôles'
    })
  }
})