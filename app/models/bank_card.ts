// app/models/bank_card.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Client from './client.js'
import Invoice from './invoice.js'

export default class BankCard extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'client_id' })
  declare clientId: number

  @column({ columnName: 'card_number' })
  declare cardNumber: string

  @column({ columnName: 'cvv' })
  declare cvv: string

  @column.dateTime({ columnName: 'expiration_date' })
  declare expirationDate: DateTime

  @column({ columnName: 'card_holder_name' })
  declare cardHolderName: string

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => Client, {
    foreignKey: 'clientId',
  })
  declare client: BelongsTo<typeof Client>

  // Relación 1 a N con Invoice
  @hasMany(() => Invoice, {
    foreignKey: 'bankCardId',
  })
  declare invoices: HasMany<typeof Invoice>
}
