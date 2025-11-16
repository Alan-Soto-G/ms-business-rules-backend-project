import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import GuideActivity from '#models/guide_activity'

export default class Guide extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Specific attributes of Client
  @column({ columnName: 'user_id' })
  declare UserId: string // It comes from ms-security

  @column({ columnName: 'license_number' })
  declare licenseNumber: string

  @column({ columnName: 'specialties' })
  declare specialties: string | null

  @column({ columnName: 'rating' })
  declare rating: number

  @column({ columnName: 'is_available' })
  declare isAvailable: boolean

  // Relation 1 to N with Guide Activity
  @hasMany(() => GuideActivity, {
    foreignKey: 'guideId',
  })
  declare touristActivities: HasMany<typeof GuideActivity>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
