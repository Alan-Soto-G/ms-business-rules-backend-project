// app/models/invoice.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Fee from './fee.js'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare feeId: number

  @column()
  declare invoiceNumber: string

  @column()
  declare totalAmount: number

  @column.dateTime()
  declare issueDate: DateTime

  @column.dateTime()
  declare paymentDate: DateTime

  @column()
  declare paymentMethod: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Fee, {
    foreignKey: 'feeId',
  })
  declare fee: BelongsTo<typeof Fee>
}