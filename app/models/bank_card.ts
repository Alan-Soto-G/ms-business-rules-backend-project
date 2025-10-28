// app/models/bank_card.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Client from './client.js'

export default class BankCard extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Relación con el usuario dueño
  @column()
  declare userId: number

  @belongsTo(() => )
  declare user: BelongsTo<typeof Client>

  // Información de la tarjeta (tokenizada por ePayco)
  @column()
  declare token: string // Token de ePayco para la tarjeta

  @column()
  declare franchiseName: string // Visa, Mastercard, Amex, etc.

  @column()
  declare lastFourDigits: string // Últimos 4 dígitos (ej: "4242")

  @column()
  declare cardholderName: string // Nombre del titular

  @column()
  declare expiryMonth: string // Mes de expiración (01-12)

  @column()
  declare expiryYear: string // Año de expiración (2025, 2026, etc.)

  // Datos adicionales de ePayco
  @column()
  declare epaycoCustomerId: string // ID del cliente en ePayco

  @column()
  declare mask: string // Máscara completa de la tarjeta (ej: "424242******4242")

  // Estado
  @column()
  declare isDefault: boolean // Si es la tarjeta predeterminada del usuario

  @column()
  declare isActive: boolean // Si la tarjeta está activa

  // Metadata
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}