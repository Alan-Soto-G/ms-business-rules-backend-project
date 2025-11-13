import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Hotel from './hotel.js'

export default class HotelAdmin extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  // Atributos específicos de administrador
  @column({ columnName: 'is_verified' })
  declare isVerified: boolean

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // Relación 1 a N con Hotel
  @hasMany(() => Hotel, {
    foreignKey: 'hotelAdminId',
  })
  declare hotels: HasMany<typeof Hotel>
}
