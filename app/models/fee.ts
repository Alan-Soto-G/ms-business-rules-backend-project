// app/models/fee.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Trip from './trip.js'
import Invoice from './invoice.js'

export default class Fee extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'trip_id' })
  declare tripId: number

  @column({ columnName: 'amount' })
  declare amount: number

  @column({ columnName: 'description' })
  declare description: string

  @column.dateTime({ columnName: 'due_date' })
  declare dueDate: DateTime

  @column({ columnName: 'status' })
  declare status: string // 'pending', 'paid', 'overdue'

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
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
