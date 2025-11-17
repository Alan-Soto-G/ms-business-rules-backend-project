import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import Aircraft from '#models/transportation/aircraft'
import Gps from '#models/transportation/gps'
import Car from '#models/transportation/car'
import TransportationService from '#models/transportation/transportation_service'

export default class Vehicle extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Specific attributes of Vehicle
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
  @hasOne(() => Aircraft, {
    foreignKey: 'vehicleId',
  })
  declare aircraft: HasOne<typeof Aircraft>

  // Relación 1 a 1 con GPS
  @hasOne(() => Gps, {
    foreignKey: 'vehicleId',
  })
  declare gps: HasOne<typeof Gps>

  // Relación 1 a 1 con Car
  @hasOne(() => Car, {
    foreignKey: 'vehicleId',
  })
  declare car: HasOne<typeof Car>

  // Relation 1 to N with Transportation Service
  @hasMany(() => TransportationService, {
    foreignKey: 'vehicleId',
  })
  declare transportationServices: HasMany<typeof TransportationService>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
