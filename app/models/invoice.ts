// app/models/invoice.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Fee from './fee.js'
import BankCard from './bank_card.js'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'fee_id' })
  declare feeId: number

  @column({ columnName: 'bank_card_id' })
  declare bankCardId: number | null

  @column({ columnName: 'invoice_number' })
  declare invoiceNumber: string

  @column({ columnName: 'total_amount' })
  declare totalAmount: number

  @column.dateTime({ columnName: 'issue_date' })
  declare issueDate: DateTime

  @column.dateTime({ columnName: 'payment_date' })
  declare paymentDate: DateTime

  @column({ columnName: 'payment_method' })
  declare paymentMethod: string

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => Fee, {
    foreignKey: 'feeId',
  })
  declare fee: BelongsTo<typeof Fee>

  @belongsTo(() => BankCard, {
    foreignKey: 'bankCardId',
  })
  declare bankCard: BelongsTo<typeof BankCard>
}
