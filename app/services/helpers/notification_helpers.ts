/**
 * Helpers para Notificaciones
 *
 * Funciones auxiliares para facilitar la emisión de eventos
 */

import Trip from '#models/core/trip'
import TripClient from '#models/pivots/trip_client'
import Client from '#models/core/client'
import { AffectedClient } from '#services/types/notification_types'
import SecurityService from '#services/core/security_service'

const securityService = new SecurityService()

/**
 * Obtiene la lista de clientes afectados de un viaje
 */
export async function getAffectedClientsFromTrip(tripId: number): Promise<AffectedClient[]> {
  try {
    // Cargar clientes del viaje a través de la tabla pivote
    const tripClients = await TripClient.query().where('trip_id', tripId).preload('client')

    // Obtener datos reales de cada cliente desde MS de seguridad
    const clients: AffectedClient[] = []

    for (const tripClient of tripClients) {
      try {
        const userData = await securityService.findById(tripClient.client.userId)

        if (userData) {
          clients.push({
            name: userData.name || `Usuario ${userData._id}`,
            email: userData.email || `user${userData._id}@placeholder.com`,
            phone: undefined,
          })
        } else {
          // Fallback si no se encuentra el usuario
          console.warn(`Usuario ${tripClient.client.userId} no encontrado en MS de seguridad`)
          clients.push({
            name: `User ${tripClient.client.userId}`,
            email: `user${tripClient.client.userId}@placeholder.com`,
            phone: undefined,
          })
        }
      } catch (error) {
        console.error(`Error al obtener datos del usuario ${tripClient.client.userId}:`, error)
        // Fallback en caso de error
        clients.push({
          name: `User ${tripClient.client.userId}`,
          email: `user${tripClient.client.userId}@placeholder.com`,
          phone: undefined,
        })
      }
    }

    return clients
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
 */
export async function formatClient(client: Client): Promise<AffectedClient> {
  try {
    const userData = await securityService.findById(client.userId)

    if (userData) {
      return {
        name: userData.name || `Usuario ${userData._id}`,
        email: userData.email || `user${userData._id}@placeholder.com`,
        phone: undefined,
      }
    }
  } catch (error) {
    console.error(`Error al obtener datos del usuario ${client.userId}:`, error)
  }

  // Fallback si hay error o no se encuentra
  return {
    name: `User ${client.userId}`,
    email: `user${client.userId}@placeholder.com`,
    phone: undefined,
  }
}
