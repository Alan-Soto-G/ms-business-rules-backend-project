// app/models/invoice.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Fee from '#models/fee'
import BankCard from '#models/bank_card'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare invoiceNumber: string

  // Relación con Fee (1:1)
  @column()
  declare feeId: number

  @belongsTo(() => Fee)
  declare fee: BelongsTo<typeof Fee>

  // Relación con BankCard (N:1)
  @column()
  declare bankCardId: number

  @belongsTo(() => BankCard)
  declare bankCard: BelongsTo<typeof BankCard>

  // Montos
  @column()
  declare subtotal: number

  @column()
  declare totalFees: number

  @column()
  declare taxAmount: number

  @column()
  declare total: number

  @column()
  declare currency: string

  // Estado del pago
  @column()
  declare status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'

  @column()
  declare paymentMethod: 'credit_card' | 'debit_card' | 'pse' | 'cash' | 'other'

  // Información de ePayco
  @column()
  declare epaycoTransactionId: string | null

  @column()
  declare epaycoReferenceCode: string | null

  @column()
  declare epaycoResponseCode: string | null

  @column()
  declare epaycoResponseMessage: string | null

  @column()
  declare epaycoAuthorizationCode: string | null

  @column()
  declare epaycoReceiptNumber: string | null

  @column.dateTime()
  declare paidAt: DateTime | null

  @column.dateTime()
  declare dueDate: DateTime | null

  @column()
  declare notes: string | null

  @column()
  declare metadata: Record<string, any> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}