// app/models/financial/fee.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import TripClient from '#models/pivots/trip_client'
import Invoice from '#models/financial/invoice'

export default class Fee extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // ✅ Foreign key - Ahora apunta a TripClient
  @column({ columnName: 'trip_client_id' })
  declare tripClientId: number

  // Número de cuota
  @column({ columnName: 'installment_number' })
  declare installmentNumber: number

  // Specific attributes of Fee
  @column({ columnName: 'amount' })
  declare amount: number

  @column({ columnName: 'description' })
  declare description: string

  @column.dateTime({ columnName: 'due_date' })
  declare dueDate: DateTime

  @column({ columnName: 'status' })
  declare status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded'

  // ✅ Relation N to 1 with TripClient (en lugar de Trip)
  @belongsTo(() => TripClient, {
    foreignKey: 'tripClientId',
  })
  declare tripClient: BelongsTo<typeof TripClient>

  // Relation 1 to 1 with Invoice
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