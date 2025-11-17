import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Trip from '#models/core/trip'
import Room from '#models/accommodation/room'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'trip_id' })
  declare tripId: number

  @column({ columnName: 'room_id' })
  declare roomId: number

  // Relation N to 1 with Trip
  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  declare trip: BelongsTo<typeof Trip>

  // Relation N to 1 with Room
  @belongsTo(() => Room, {
    foreignKey: 'roomId',
  })
  declare room: BelongsTo<typeof Room>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
