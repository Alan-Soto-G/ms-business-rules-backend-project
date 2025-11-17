import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Journey from '#models/transportation/journey'
import Trip from '#models/core/trip'
import TransportationService from '#models/transportation/transportation_service'

export default class TransportItinerary extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'journey_id' })
  declare journeyId: number

  @column({ columnName: 'trip_id' })
  declare tripId: number

  @column({ columnName: 'transportation_service_id' })
  declare transportationServiceId: number

  // Specific attributes of Transport Itinerary
  @column({ columnName: 'order' })
  declare order: number

  // Relation N to 1 with Journey
  @belongsTo(() => Journey, {
    foreignKey: 'journeyId',
  })
  declare journey: BelongsTo<typeof Journey>

  // Relation N to 1 with Trip
  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  declare trip: BelongsTo<typeof Trip>

  // Relation N to 1 with Transportation Service
  @belongsTo(() => TransportationService, {
    foreignKey: 'transportationServiceId',
  })
  declare transportationService: BelongsTo<typeof TransportationService>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
