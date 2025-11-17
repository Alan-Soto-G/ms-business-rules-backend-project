import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Vehicle from '#models/transportation/vehicle'
import Hotel from '#models/accommodation/hotel'

export default class Car extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'vehicle_id' })
  declare vehicleId: number

  @column({ columnName: 'hotel_id' })
  declare hotelId: number

  // Specific attributes of Car
  @column({ columnName: 'fuel_type' })
  declare fuelType: string

  @column({ columnName: 'transmission_type' })
  declare transmissionType: string

  // Relation 1 to 1 with Vehicle
  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
  })
  declare vehicle: BelongsTo<typeof Vehicle>

  // Relación N a 1 con Hotel
  @belongsTo(() => Hotel, {
    foreignKey: 'hotelId',
  })
  declare hotel: BelongsTo<typeof Hotel>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
