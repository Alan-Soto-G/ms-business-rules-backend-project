import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Hotel from '#models/accommodation/hotel'

export default class HotelAdmin extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Specific attributes of Client
  @column({ columnName: 'user_id' })
  declare UserId: string // It comes from ms-security

  @column({ columnName: 'is_verified' })
  declare isVerified: boolean

  // Relation 1 to N with Hotel
  @hasMany(() => Hotel, {
    foreignKey: 'hotelAdminId',
  })
  declare hotels: HasMany<typeof Hotel>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
