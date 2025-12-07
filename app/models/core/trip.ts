// app/models/trip.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, beforeUpdate } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Fee from '#models/financial/fee'
import Booking from '#models/accommodation/booking'
import TripClient from '#models/pivots/trip_client'
import TripPlan from '#models/pivots/trip_plan'
import TransportItinerary from '#models/transportation/transport_itinerary'
import notificationService from '#services/notification_service'
import { getAffectedClientsFromTrip } from '#services/helpers/notification_helpers'

export default class Trip extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Specific attributes of Trip
  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'description' })
  declare description: string

  @column({ columnName: 'price' })
  declare price: number

  @column({ columnName: 'capacity' })
  declare capacity: number

  @column({ columnName: 'available_seats' })
  declare availableSeats: number

  @column({ columnName: 'status' })
  declare status: 'draft' | 'published' | 'active' | 'full' | 'completed' | 'cancelled'

  @column.dateTime({ columnName: 'start_date' })
  declare startDate: DateTime

  @column.dateTime({ columnName: 'end_date' })
  declare endDate: DateTime

  @column({ columnName: 'destination' })
  declare destination: string

  // Relation 1 to N with Fee
  @hasMany(() => Fee, {
    foreignKey: 'tripId',
  })
  declare fees: HasMany<typeof Fee>

  // Relation 1 to N with Trip Client
  @hasMany(() => TripClient, {
    foreignKey: 'tripId',
  })
  declare tripClients: HasMany<typeof TripClient>

  // Relation 1 to N with Trip Plan
  @hasMany(() => TripPlan, {
    foreignKey: 'tripId',
  })
  declare tripPlans: HasMany<typeof TripPlan>

  // Relation 1 to N with Trip Room
  @hasMany(() => Booking, {
    foreignKey: 'tripId',
  })
  declare Bookings: HasMany<typeof Booking>

  // Relation 1 to N with Transport Itinerary
  @hasMany(() => TransportItinerary, {
    foreignKey: 'tripId',
  })
  declare transportItineraries: HasMany<typeof TransportItinerary>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  /**
   * Hook: Detecta cambios de estado y emite notificaciones
   */
  @beforeUpdate()
  static async notifyStatusChange(trip: Trip) {
    // Solo notificar si el estado cambió
    if (trip.$dirty.status) {
      const oldStatus = trip.$original.status
      const newStatus = trip.status

      // Obtener clientes afectados
      const affectedClients = await getAffectedClientsFromTrip(trip.id)

      // Notificar cancelación del viaje
      if (newStatus === 'cancelled') {
        await notificationService.notifyTripCancelled({
          tripId: trip.id,
          tripName: trip.name,
          reason: 'Viaje cancelado por la agencia',
          affectedClients,
        })
      }

      // Notificar finalización del servicio
      if (newStatus === 'completed' && oldStatus === 'active') {
        const mainClient = affectedClients[0] // Cliente principal
        if (mainClient) {
          await notificationService.notifyServiceCompleted({
            tripId: trip.id,
            tripName: trip.name,
            startDate: trip.startDate.toISO() || '',
            endDate: trip.endDate.toISO() || '',
            destination: trip.destination,
            summary: {
              activitiesCompleted: 0, // Esto debería calcularse desde las actividades del plan
              accommodations: [],
              highlights: ['Viaje completado exitosamente'],
            },
            mainClient,
          })
        }
      }

      // Notificar cualquier cambio de estado si hay clientes activos
      if (affectedClients.length > 0 && ['active', 'published', 'cancelled'].includes(newStatus)) {
        await notificationService.notifyTripStatusChanged({
          tripId: trip.id,
          tripName: trip.name,
          oldStatus,
          newStatus,
          clients: affectedClients,
        })
      }
    }
  }
}
