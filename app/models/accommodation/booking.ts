import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, afterCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Trip from '#models/core/trip'
import Room from '#models/accommodation/room'
import notificationService from '#services/notification_service'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'trip_id' })
  declare tripId: number

  @column({ columnName: 'room_id' })
  declare roomId: number

  // Relation N to 1 with Trip
  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  declare trip: BelongsTo<typeof Trip>

  // Relation N to 1 with Room
  @belongsTo(() => Room, {
    foreignKey: 'roomId',
  })
  declare room: BelongsTo<typeof Room>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  /**
   * Hook: Notifica automáticamente cuando se confirma una reserva
   */
  @afterCreate()
  static async notifyBookingConfirmed(booking: Booking) {
    // Cargar relaciones necesarias
    await booking.load('room', (query) => {
      query.preload('hotel')
    })
    await booking.load('trip')

    // Obtener datos del primer cliente del viaje desde MS-security
    const { getAffectedClientsFromTrip } = await import('#services/helpers/notification_helpers')
    const clients = await getAffectedClientsFromTrip(booking.tripId)
    const mainClient = clients[0] // Cliente principal

    if (!mainClient) {
      console.warn(`No se encontraron clientes para el viaje ${booking.tripId}`)
      return
    }

    await notificationService.notifyBookingConfirmed({
      bookingId: booking.id,
      hotelName: booking.room.hotel?.name || 'Hotel',
      roomType: booking.room.roomType,
      checkInDate: DateTime.now().toISO() || '', // TODO: Agregar campos al modelo Booking
      checkOutDate: DateTime.now().plus({ days: 3 }).toISO() || '',
      clientName: mainClient.name,
      clientEmail: mainClient.email,
      tripId: booking.tripId,
      tripName: booking.trip.name,
    })
  }
}
