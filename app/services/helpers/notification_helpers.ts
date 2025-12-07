/**
 * Helpers para Notificaciones
 *
 * Funciones auxiliares para facilitar la emisión de eventos
 */

import Trip from '#models/core/trip'
import TripClient from '#models/pivots/trip_client'
import Client from '#models/core/client'
import { AffectedClient } from '#services/types/notification_types'

/**
 * Obtiene la lista de clientes afectados de un viaje
 */
export async function getAffectedClientsFromTrip(tripId: number): Promise<AffectedClient[]> {
  try {
    // Cargar clientes del viaje a través de la tabla pivote
    const tripClients = await TripClient.query().where('trip_id', tripId).preload('client')

    // NOTA: Client no tiene name/email/phone directamente (vienen del MS de seguridad)
    // En producción, deberías hacer una llamada al MS de seguridad con el userId
    // Por ahora, retornamos un placeholder
    return tripClients.map((tripClient) => ({
      name: `User ${tripClient.client.userId}`, // Placeholder - obtener del MS seguridad
      email: `user${tripClient.client.userId}@placeholder.com`, // Placeholder
      phone: undefined,
    }))
  } catch (error) {
    console.error('Error al obtener clientes afectados:', error)
    return []
  }
}

/**
 * Obtiene información básica del viaje
 */
export async function getTripInfo(tripId: number) {
  try {
    const trip = await Trip.find(tripId)
    if (!trip) {
      throw new Error(`Viaje ${tripId} no encontrado`)
    }

    return {
      id: trip.id,
      name: trip.name,
      status: trip.status,
      startDate: trip.startDate.toISO(),
      endDate: trip.endDate.toISO(),
      destination: trip.destination,
    }
  } catch (error) {
    console.error('Error al obtener información del viaje:', error)
    throw error
  }
}

/**
 * Verifica si un viaje está activo o en servicio
 */
export function isTripInService(status: string): boolean {
  return ['active', 'published'].includes(status)
}

/**
 * Verifica si un vehículo está en servicio
 */
export function isVehicleInService(status: string): boolean {
  return ['available', 'in_use', 'en_servicio'].includes(status.toLowerCase())
}

/**
 * Formatea datos de cliente individual
 * NOTA: Client solo tiene userId - los datos completos están en MS de seguridad
 */
export function formatClient(client: Client): AffectedClient {
  return {
    name: `User ${client.userId}`, // Placeholder - obtener del MS seguridad
    email: `user${client.userId}@placeholder.com`, // Placeholder
    phone: undefined,
  }
}
