// app/models/trip_plan.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Trip from './trip.js'
import Plan from './plan.js'

export default class TripPlan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'trip_id' })
  declare tripId: number

  @column({ columnName: 'plan_id' })
  declare planId: number

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  declare trip: BelongsTo<typeof Trip>

  @belongsTo(() => Plan, {
    foreignKey: 'planId',
  })
  declare plan: BelongsTo<typeof Plan>
}
