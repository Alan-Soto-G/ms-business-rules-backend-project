import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Hotel from '#models/accommodation/hotel'
import TouristActivity from '#models/tourism/tourist_activity'
import Journey from '#models/transportation/journey'

export default class Municipality extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Specific attributes of Municipality
  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'department' })
  declare department: string

  @column({ columnName: 'code' })
  declare code: string

  // Relation 1 to N reflexive - origin municipalities --> Journey
  @hasMany(() => Journey, {
    foreignKey: 'originMunicipalityId',
  })
  declare originJourneys: HasMany<typeof Journey>

  // Relation 1 to N reflexive - destination municipalities --> Journey
  @hasMany(() => Journey, {
    foreignKey: 'destinationMunicipalityId',
  })
  declare destinationJourneys: HasMany<typeof Journey>

  // Relación 1 a N con Hotel
  @hasMany(() => Hotel, {
    foreignKey: 'municipalityId',
  })
  declare hotels: HasMany<typeof Hotel>

  // Relación 1 a N con TouristActivity
  @hasMany(() => TouristActivity, {
    foreignKey: 'municipalityId',
  })
  declare touristActivities: HasMany<typeof TouristActivity>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
