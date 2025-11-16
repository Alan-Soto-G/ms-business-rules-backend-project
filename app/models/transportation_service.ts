import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type Journey from '#models/journey'
import type Vehicle from '#models/vehicle'
import type TransportItinerary from '#models/transport_itinerary'

export default class TransportationService extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'journey_id' })
  declare journeyId: number

  @column({ columnName: 'vehicle_id' })
  declare vehicleId: number

  // Specific attributes of Transportation Service
  @column({ columnName: 'start_date' })
  declare startDate: DateTime

  @column({ columnName: 'end_date' })
  declare endDate: DateTime

  @column({ columnName: 'cost' })
  declare cost: number

  // Relation N to 1 with Journey
  @belongsTo(() => Journey, {
    foreignKey: 'journeyId',
  })
  declare journey: BelongsTo<typeof Journey>

  // Relation N to 1 with Vehicle
  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
  })
  declare vehicle: BelongsTo<typeof Vehicle>

  // Relation 1 to N with Transport Itinerary
  @hasMany(() => TransportItinerary, {
    foreignKey: 'transportationServiceId',
  })
  declare transportItineraries: HasMany<typeof TransportItinerary>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
