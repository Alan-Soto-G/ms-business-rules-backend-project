import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Hotel from './hotel.js'
import Trip from './trip.js'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'hotel_id' })
  declare hotelId: number

  // Atributos básicos de habitación
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

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // Relación N a 1 con Hotel
  @belongsTo(() => Hotel, {
    foreignKey: 'hotelId',
  })
  declare hotel: BelongsTo<typeof Hotel>

  // Relación N a N con Trip a través de trip_rooms
  @manyToMany(() => Trip, {
    pivotTable: 'trip_rooms',
    localKey: 'id',
    pivotForeignKey: 'room_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'trip_id',
  })
  declare trips: ManyToMany<typeof Trip>
}
