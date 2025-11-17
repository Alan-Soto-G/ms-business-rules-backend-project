import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Plan from '#models/core/plan'
import TouristActivity from '#models/tourism/tourist_activity'

export default class PlanActivity extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'plan_id' })
  declare planId: number

  @column({ columnName: 'activity_id' })
  declare activityId: number

  // Specific attributes of PlanActivity
  @column({ columnName: 'order' })
  declare order: number

  // Relation N to 1 with Plan
  @belongsTo(() => Plan, {
    foreignKey: 'planId',
  })
  declare plan: BelongsTo<typeof Plan>

  // Relation N to 1 with Activity
  @belongsTo(() => TouristActivity, {
    foreignKey: 'activityId',
  })
  declare activity: BelongsTo<typeof TouristActivity>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
