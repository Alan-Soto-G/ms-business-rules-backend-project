import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import BankCard from '#models/financial/bank_card'
import TripClient from '#models/pivots/trip_client'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Specific attributes of Client
  @column({ columnName: 'user_id' })
  declare UserId: string // It comes from ms-security

  @column({ columnName: 'emergency_contact_name' })
  declare emergencyContactName: string | null

  @column({ columnName: 'emergency_contact_phone' })
  declare emergencyContactPhone: string | null

  @column({ columnName: 'allergies' })
  declare allergies: string | null

  @column({ columnName: 'loyalty_points' })
  declare loyaltyPoints: number

  @column({ columnName: 'is_vip' })
  declare isVip: boolean

  // Relation N to 1 with Bank Card
  @hasMany(() => BankCard, {
    foreignKey: 'clientId',
  })
  declare bankCards: HasMany<typeof BankCard>

  // Relation 1 to N with Trip Client
  @hasMany(() => TripClient, {
    foreignKey: 'clientId',
  })
  declare tripClients: HasMany<typeof TripClient>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
