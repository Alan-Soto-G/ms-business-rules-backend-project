// app/models/trip_room.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Trip from './trip.js'
import Room from './room.js'

export default class TripRoom extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'trip_id' })
  declare tripId: number

  @column({ columnName: 'room_id' })
  declare roomId: number

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  declare trip: BelongsTo<typeof Trip>

  @belongsTo(() => Room, {
    foreignKey: 'roomId',
  })
  declare room: BelongsTo<typeof Room>
}
