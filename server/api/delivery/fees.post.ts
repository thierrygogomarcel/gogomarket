import { createError } from 'h3'

interface Location {
  latitude: number
  longitude: number
}

function calculateDistance(origin: Location, destination: Location): number {
  // Formule de Haversine pour calculer la distance entre deux points
  const R = 6371 // Rayon de la Terre en km
  const dLat = (destination.latitude - origin.latitude) * Math.PI / 180
  const dLon = (destination.longitude - origin.longitude) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(origin.latitude * Math.PI / 180) * Math.cos(destination.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export default defineEventHandler(async (event) => {
  try {
    const { origin, destination, weight } = await readBody(event)

    if (!origin || !destination || !weight) {
      throw createError({
        statusCode: 400,
        message: 'Origine, destination et poids requis'
      })
    }

    // Calculer la distance
    const distance = calculateDistance(origin, destination)

    // Calculer les frais de base (exemple simplifié)
    const baseFee = 1000 // FCFA
    const distanceFee = distance * 100 // 100 FCFA par km
    const weightFee = weight * 200 // 200 FCFA par kg

    const totalFees = baseFee + distanceFee + weightFee

    return {
      distance: Math.round(distance * 100) / 100, // Arrondir à 2 décimales
      fees: Math.round(totalFees),
      details: {
        baseFee,
        distanceFee: Math.round(distanceFee),
        weightFee: Math.round(weightFee)
      },
      estimatedTime: Math.ceil(distance / 50) * 24 // Estimation en heures (50km/h en moyenne)
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors du calcul des frais de livraison'
    })
  }
})