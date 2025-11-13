import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Hotel from './hotel.js'
import TouristActivity from './tourist_activity.js'

export default class Municipality extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'department' })
  declare department: string

  @column({ columnName: 'code' })
  declare code: string

  // Relación N a N reflexiva - municipios de origen
  @manyToMany(() => Municipality, {
    pivotTable: 'itineraries',
    localKey: 'id',
    pivotForeignKey: 'origin_municipality_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'destination_municipality_id',
  })
  declare destinations: ManyToMany<typeof Municipality>

  // Relación N a N reflexiva - municipios de destino
  @manyToMany(() => Municipality, {
    pivotTable: 'itineraries',
    localKey: 'id',
    pivotForeignKey: 'destination_municipality_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'origin_municipality_id',
  })
  declare origins: ManyToMany<typeof Municipality>

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

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
