// app/models/fee.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Trip from './trip.js'
import Invoice from './invoice.js'

export default class Fee extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tripId: number

  @column()
  declare amount: number

  @column()
  declare description: string

  @column.dateTime()
  declare dueDate: DateTime

  @column()
  declare status: string // 'pending', 'paid', 'overdue'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  declare trip: BelongsTo<typeof Trip>

  @hasMany(() => Invoice, {
    foreignKey: 'feeId',
  })
  declare invoices: HasMany<typeof Invoice>
}