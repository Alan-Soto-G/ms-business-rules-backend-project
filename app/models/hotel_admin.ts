import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
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

  // Relación 1 a 1 con User
  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  // Relación 1 a N con Hotel
  @hasMany(() => Hotel, {
    foreignKey: 'hotelAdminId',
  })
  declare hotels: HasMany<typeof Hotel>
}
