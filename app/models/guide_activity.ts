import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Guide from '#models/guide'
import TouristActivity from '#models/tourist_activity'

export default class GuideActivity extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'guide_id' })
  declare guideId: number

  @column({ columnName: 'activity_id' })
  declare activityId: number

  // Specific attributes of GuideActivity
  @column.dateTime({ columnName: 'assignment_date' })
  declare assignmentDate: DateTime

  // Relation N to 1 with Guide
  @belongsTo(() => Guide, {
    foreignKey: 'guideId',
  })
  declare guide: BelongsTo<typeof Guide>

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
