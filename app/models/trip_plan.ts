// app/models/trip_plan.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Trip from './trip.js'
import Plan from './plan.js'

export default class TripPlan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tripId: number

  @column()
  declare planId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
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