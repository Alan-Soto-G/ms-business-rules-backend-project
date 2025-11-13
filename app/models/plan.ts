import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import TouristActivity from './tourist_activity.js'
import Trip from './trip.js'

export default class Plan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'description' })
  declare description: string | null

  @column({ columnName: 'price' })
  declare price: number

  @column({ columnName: 'duration' })
  declare duration: number | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // Relación N a N con TouristActivity
  @manyToMany(() => TouristActivity, {
    pivotTable: 'activity_plan',
    localKey: 'id',
    pivotForeignKey: 'plan_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'tourist_activity_id',
  })
  declare touristActivities: ManyToMany<typeof TouristActivity>

  // Relación N a N con Trip
  @manyToMany(() => Trip, {
    pivotTable: 'trip_plans',
    localKey: 'id',
    pivotForeignKey: 'plan_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'trip_id',
  })
  declare trips: ManyToMany<typeof Trip>
}
