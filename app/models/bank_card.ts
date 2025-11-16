import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Client from '#models/client'
import Invoice from '#models/invoice'

export default class BankCard extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign key
  @column({ columnName: 'client_id' })
  declare clientId: number

  // Specific attributes of BankCard
  @column({ columnName: 'card_number' })
  declare cardNumber: string

  @column({ columnName: 'cvv' })
  declare cvv: string

  @column.dateTime({ columnName: 'expiration_date' })
  declare expirationDate: DateTime

  @column({ columnName: 'card_holder_name' })
  declare cardHolderName: string

  // Relation 1 to N with Invoice
  @hasMany(() => Invoice, {
    foreignKey: 'bankCardId',
  })
  declare invoices: HasMany<typeof Invoice>

  // Relation N to 1 with Client
  @belongsTo(() => Client, {
    foreignKey: 'clientId',
  })
  declare client: BelongsTo<typeof Client>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
