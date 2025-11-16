import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Municipality from '#models/municipality'
import TransportationService from '#models/transportation_service'

export default class Journey extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'origin_municipality_id' })
  declare originMunicipalityId: number

  @column({ columnName: 'destination_municipality_id' })
  declare destinationMunicipalityId: number

  // Specific attributes of Journey
  @column({ columnName: 'distance' })
  declare distance: number | null

  // Relation with the origin municipality
  @belongsTo(() => Municipality, {
    foreignKey: 'originMunicipalityId',
  })
  declare originMunicipality: BelongsTo<typeof Municipality>

  // Relation with the destination municipality
  @belongsTo(() => Municipality, {
    foreignKey: 'destinationMunicipalityId',
  })
  declare destinationMunicipality: BelongsTo<typeof Municipality>

  // Relation 1 to N with Transportation Service
  @hasMany(() => TransportationService, {
    foreignKey: 'journeyId',
  })
  declare transportationServices: HasMany<typeof TransportationService>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
