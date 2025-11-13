import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Municipality from './municipality.js'
import Vehicle from './vehicle.js'
import Trip from './trip.js'

export default class Itinerary extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'origin_municipality_id' })
  declare originMunicipalityId: number

  @column({ columnName: 'destination_municipality_id' })
  declare destinationMunicipalityId: number

  @column({ columnName: 'vehicle_id' })
  declare vehicleId: number

  @column({ columnName: 'trip_id' })
  declare tripId: number

  @column({ columnName: 'distance' })
  declare distance: number | null

  @column({ columnName: 'estimated_time' })
  declare estimatedTime: number | null

  // Relación con el municipio de origen
  @belongsTo(() => Municipality, {
    foreignKey: 'originMunicipalityId',
  })
  declare originMunicipality: BelongsTo<typeof Municipality>

  // Relación con el municipio de destino
  @belongsTo(() => Municipality, {
    foreignKey: 'destinationMunicipalityId',
  })
  declare destinationMunicipality: BelongsTo<typeof Municipality>

  // Relación N a 1 con Vehicle
  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
  })
  declare vehicle: BelongsTo<typeof Vehicle>

  // Relación 1 a 1 con Trip
  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  declare trip: BelongsTo<typeof Trip>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
