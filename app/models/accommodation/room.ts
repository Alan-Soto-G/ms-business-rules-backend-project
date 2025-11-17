import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Hotel from '#models/accommodation/hotel'
import Booking from '#models/accommodation/booking'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign key
  @column({ columnName: 'hotel_id' })
  declare hotelId: number

  // Specific attributes of Room
  @column({ columnName: 'room_number' })
  declare roomNumber: string

  @column({ columnName: 'room_type' })
  declare roomType: string

  @column({ columnName: 'capacity' })
  declare capacity: number

  @column({ columnName: 'price_per_night' })
  declare pricePerNight: number

  @column({ columnName: 'status' })
  declare status: 'available' | 'occupied' | 'maintenance'

  // Relation N to 1 with Hotel
  @belongsTo(() => Hotel, {
    foreignKey: 'hotelId',
  })
  declare hotel: BelongsTo<typeof Hotel>

  // Relación 1 a N with Booking
  @hasMany(() => Booking, {
    foreignKey: 'roomId',
  })
  declare bookings: HasMany<typeof Booking>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
