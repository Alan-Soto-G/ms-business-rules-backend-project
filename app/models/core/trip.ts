// app/models/trip.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Booking from '#models/accommodation/booking'
import TripClient from '#models/pivots/trip_client'
import TripPlan from '#models/pivots/trip_plan'
import TransportItinerary from '#models/transportation/transport_itinerary'

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



  // ✅ Relation 1 to N with Trip Client
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
  declare bookings: HasMany<typeof Booking>

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
}