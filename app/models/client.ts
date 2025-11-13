import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import BankCard from './bank_card.js'
import Trip from './trip.js'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  // Atributos específicos de cliente
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

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // Relación 1 a 1 con User
  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  // Relación 1 a N con BankCard
  @hasMany(() => BankCard, {
    foreignKey: 'clientId',
  })
  declare bankCards: HasMany<typeof BankCard>

  // Relación N a N con Trip a través de trip_clients
  @manyToMany(() => Trip, {
    pivotTable: 'trip_clients',
    localKey: 'id',
    pivotForeignKey: 'client_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'trip_id',
  })
  declare trips: ManyToMany<typeof Trip>
}
