import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Vehicle from './vehicle.js'
import Hotel from './hotel.js'

export default class Car extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'vehicle_id' })
  declare vehicleId: number

  @column({ columnName: 'hotel_id' })
  declare hotelId: number

  // Atributos específicos de carro
  @column({ columnName: 'fuel_type' })
  declare fuelType: string

  @column({ columnName: 'transmission_type' })
  declare transmissionType: string

  // Relación 1 a 1 con Vehicle
  @belongsTo(() => Vehicle)
  declare vehicle: BelongsTo<typeof Vehicle>

  // Relación N a 1 con Hotel
  @belongsTo(() => Hotel)
  declare hotel: BelongsTo<typeof Hotel>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
