import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import HotelAdmin from './hotel_admin.js'
import Municipality from './municipality.js'
import Car from './car.js'
import Room from './room.js'

export default class Hotel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'hotel_admin_id' })
  declare hotelAdminId: number

  @column({ columnName: 'municipality_id' })
  declare municipalityId: number

  // Atributos básicos del hotel
  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'address' })
  declare address: string

  @column({ columnName: 'phone' })
  declare phone: string

  @column({ columnName: 'email' })
  declare email: string

  @column({ columnName: 'star_rating' })
  declare starRating: number

  @column({ columnName: 'status' })
  declare status: 'active' | 'inactive'

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // Relación N a 1 con HotelAdmin
  @belongsTo(() => HotelAdmin, {
    foreignKey: 'hotelAdminId',
  })
  declare hotelAdmin: BelongsTo<typeof HotelAdmin>

  // Relación N a 1 con Municipality
  @belongsTo(() => Municipality, {
    foreignKey: 'municipalityId',
  })
  declare municipality: BelongsTo<typeof Municipality>

  // Relación 1 a N con Car
  @hasMany(() => Car, {
    foreignKey: 'hotelId',
  })
  declare cars: HasMany<typeof Car>

  // Relación 1 a N con Room
  @hasMany(() => Room, {
    foreignKey: 'hotelId',
  })
  declare rooms: HasMany<typeof Room>
}
