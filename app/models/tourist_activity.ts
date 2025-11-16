import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Municipality from '#models/municipality'
import GuideActivity from '#models/guide_activity'
import PlanActivity from '#models/plan_activity'

export default class TouristActivity extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign key
  @column({ columnName: 'municipality_id' })
  declare municipalityId: number

  // Specific attributes of TouristActivity
  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'description' })
  declare description: string | null

  @column({ columnName: 'price' })
  declare price: number | null

  @column({ columnName: 'duration' })
  declare duration: number | null

  @column({ columnName: 'category' })
  declare category: 'cultural' | 'adventure' | 'gastronomic' | 'recreational' | 'other'

  // Relación N a 1 con Municipality
  @belongsTo(() => Municipality, {
    foreignKey: 'municipalityId',
  })
  declare municipality: BelongsTo<typeof Municipality>

  // Relation 1 to N with Guide Activity
  @hasMany(() => GuideActivity, {
    foreignKey: 'activityId',
  })
  declare guideActivities: HasMany<typeof GuideActivity>

  // Relation 1 to N with Plan Activity
  @hasMany(() => PlanActivity, {
    foreignKey: 'activityId',
  })
  declare planActivities: HasMany<typeof PlanActivity>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
