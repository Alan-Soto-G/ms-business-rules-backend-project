import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import TouristActivity from './tourist_activity.js'

export default class Guide extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  // Atributos específicos de guía turístico
  @column({ columnName: 'license_number' })
  declare licenseNumber: string

  @column({ columnName: 'specialties' })
  declare specialties: string | null

  @column({ columnName: 'rating' })
  declare rating: number

  @column({ columnName: 'is_available' })
  declare isAvailable: boolean

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // Relación N a N con TouristActivity
  @manyToMany(() => TouristActivity, {
    pivotTable: 'guide_tourist_activity',
    localKey: 'id',
    pivotForeignKey: 'guide_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'tourist_activity_id',
  })
  declare touristActivities: ManyToMany<typeof TouristActivity>
}
