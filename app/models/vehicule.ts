// app/models/vehicle.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default abstract class Vehicle extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare licensePlate: string

  @column()
  declare brand: string

  @column()
  declare model: string

  @column()
  declare year: number

  @column()
  declare color: string

  @column()
  declare capacity: number

  @column()
  declare vehicleType: string

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}