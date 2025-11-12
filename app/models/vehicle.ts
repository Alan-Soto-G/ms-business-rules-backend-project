// app/models/vehicle.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Aircraft from './aircraft.js'

export default class Vehicle extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'license_plate' })
  declare licensePlate: string

  @column({ columnName: 'brand' })
  declare brand: string

  @column({ columnName: 'model' })
  declare model: string

  @column({ columnName: 'year' })
  declare year: number

  @column({ columnName: 'color' })
  declare color: string

  @column({ columnName: 'number_of_seats' })
  declare numberOfSeats: number

  @column({ columnName: 'vehicle_type' })
  declare vehicleType: string

  @column({ columnName: 'status' })
  declare status: string

  // Relación 1 a 1 con Aircraft
  @hasOne(() => Aircraft)
  declare aircraft: HasOne<typeof Aircraft>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
