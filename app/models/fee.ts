// app/models/fee.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Trip from '#models/trip'
import Invoice from '#models/invoice'

export default class Fee extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Relación con Trip
  @column()
  declare tripId: number

  @belongsTo(() => Trip)
  declare trip: BelongsTo<typeof Trip>

  // Relación con Invoice (uno a uno)
  @hasOne(() => Invoice)
  declare invoice: HasOne<typeof Invoice>

  // Tipo de tarifa/cuota
  @column()
  declare name: string // "Cuota 1", "Cuota 2", "Comisión", etc.

  @column()
  declare description: string

  @column()
  declare type: 'fixed' | 'percentage' | 'mixed' // Tipo de tarifa

  // Valores
  @column()
  declare fixedAmount: number // Monto fijo (ej: 5000 COP)

  @column()
  declare percentageAmount: number // Porcentaje (ej: 10 = 10%)

  @column()
  declare amount: number // Monto total de esta cuota/fee

  // Aplicabilidad
  @column()
  declare applicableTo: 'trip' | 'service' | 'payment' | 'all' // A qué se aplica

  @column()
  declare minimumAmount: number | null // Monto mínimo para aplicar

  @column()
  declare maximumAmount: number | null // Monto máximo a cobrar

  // Estado de pago de la cuota
  @column()
  declare isPaid: boolean

  @column()
  declare isActive: boolean

  // Fecha de vencimiento de la cuota
  @column.dateTime()
  declare dueDate: DateTime | null

  // Metadata
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}