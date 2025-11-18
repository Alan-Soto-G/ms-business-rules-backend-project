import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import HotelAdmin from '#models/accommodation/hotel_admin'
import Municipality from '#models/core/municipality'
import Room from '#models/accommodation/room'
import Car from '#models/transportation/car'

export default class Hotel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'hotel_admin_id' })
  declare hotelAdminId: number

  @column({ columnName: 'municipality_id' })
  declare municipalityId: number

  // Specific attributes of Hotel
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
  declare status: 'active' | 'inactive' | 'under_renovation'

  // Relation N to 1 with HotelAdmin
  @belongsTo(() => HotelAdmin, {
    foreignKey: 'hotelAdminId',
  })
  declare hotelAdmin: BelongsTo<typeof HotelAdmin>

  // Relation N to 1 with Municipality
  @belongsTo(() => Municipality, {
    foreignKey: 'municipalityId',
  })
  declare municipality: BelongsTo<typeof Municipality>

  // Relation 1 to N with Car
  @hasMany(() => Car, {
    foreignKey: 'hotelId',
  })
  declare cars: HasMany<typeof Car>

  // Relation 1 to N with Room
  @hasMany(() => Room, {
    foreignKey: 'hotelId',
  })
  declare rooms: HasMany<typeof Room>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
