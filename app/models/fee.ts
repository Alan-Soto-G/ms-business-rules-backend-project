import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Trip from '#models/trip'
import Invoice from '#models/invoice'

export default class Fee extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign key
  @column({ columnName: 'trip_id' })
  declare tripId: number

  // Specific attributes of Fee
  @column({ columnName: 'amount' })
  declare amount: number

  @column({ columnName: 'description' })
  declare description: string

  @column.dateTime({ columnName: 'due_date' })
  declare dueDate: DateTime

  @column({ columnName: 'status' })
  declare status: string // 'pending', 'paid', 'overdue'

  // Relation N to 1 with Trip
  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  declare trip: BelongsTo<typeof Trip>

  // Relation 1 to N with Invoice
  @hasOne(() => Invoice, {
    foreignKey: 'feeId',
  })
  declare invoice: HasOne<typeof Invoice>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
