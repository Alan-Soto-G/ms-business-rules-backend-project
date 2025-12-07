// app/models/pivots/trip_client.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Trip from '#models/core/trip'
import Client from '#models/core/client'
import Fee from '#models/financial/fee'

export default class TripClient extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'trip_id' })
  declare tripId: number

  @column({ columnName: 'client_id' })
  declare clientId: number

  // Información de la reserva
  @column()
  declare travelers: number

  @column()
  declare quantity: number

  // Información de pago y cuotas
  @column()
  declare installments: number

  @column({ columnName: 'total_amount' })
  declare totalAmount: number

  @column({ columnName: 'total_with_interest' })
  declare totalWithInterest: number

  @column({ columnName: 'interest_rate' })
  declare interestRate: number

  // Estado del pago
  @column({ columnName: 'payment_status' })
  declare paymentStatus: 'pending' | 'processing' | 'partial' | 'completed' | 'cancelled' | 'refunded'

  // Referencia de ePayco
  @column({ columnName: 'epayco_ref' })
  declare epaycoRef: string | null

  // Relations
  @belongsTo(() => Trip, {
    foreignKey: 'tripId',
  })
  declare trip: BelongsTo<typeof Trip>

  @belongsTo(() => Client, {
    foreignKey: 'clientId',
  })
  declare client: BelongsTo<typeof Client>

  // ✅ Relación con Fee (TripClient 1 -> N Fee)
  @hasMany(() => Fee, {
    foreignKey: 'tripClientId',
  })
  declare fees: HasMany<typeof Fee>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}