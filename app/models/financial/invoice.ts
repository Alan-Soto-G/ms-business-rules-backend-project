import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Fee from '#models/financial/fee'
import BankCard from '#models/financial/bank_card'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'fee_id' })
  declare feeId: number

  @column({ columnName: 'bank_card_id' })
  declare bankCardId: number 

  // Specific attributes of Invoice
  @column({ columnName: 'invoice_number' })
  declare invoiceNumber: string

  @column({ columnName: 'total_amount' })
  declare totalAmount: number

  @column.dateTime({ columnName: 'issue_date' })
  declare issueDate: DateTime

  @column.dateTime({ columnName: 'payment_date' })
  declare paymentDate: DateTime | null

  @column({ columnName: 'payment_method' })
  declare paymentMethod:
    | 'credit_card'
    | 'debit_card'
    | 'cash'
    | 'bank_transfer'
    | 'paypal'
    | 'other'

  // Relation 1 to 1 with Fee
  @belongsTo(() => Fee, {
    foreignKey: 'feeId',
  })
  declare fee: BelongsTo<typeof Fee>

  // Relation N to 1 with BankCard
  @belongsTo(() => BankCard, {
    foreignKey: 'bankCardId',
  })
  declare bankCard: BelongsTo<typeof BankCard>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
