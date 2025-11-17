import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import PlanActivity from '#models/tourism/plan_activity'
import TripPlan from '#models/pivots/trip_plan'

export default class Plan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Specific attributes of Plan
  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'description' })
  declare description: string | null

  @column({ columnName: 'price' })
  declare price: number

  @column({ columnName: 'duration' })
  declare duration: number | null

  // Relation 1 to N with Plan Activities
  @hasMany(() => PlanActivity, {
    foreignKey: 'planId',
  })
  declare planActivities: HasMany<typeof PlanActivity>

  // Relation 1 to N with Trip Plan
  @hasMany(() => TripPlan, {
    foreignKey: 'planId',
  })
  declare tripPlans: HasMany<typeof TripPlan>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
