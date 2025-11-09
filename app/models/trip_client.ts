// app/models/trip_client.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Trip from './trip.js'
import Client from './client.js'

export default class TripClient extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tripId: number

  @column()
  declare clientId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  declare trip: BelongsTo<typeof Trip>

  @belongsTo(() => Client, {
    foreignKey: 'clientId',
  })
  declare client: BelongsTo<typeof Client>
}
