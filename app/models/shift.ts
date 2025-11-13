import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Driver from './driver.js'
import Vehicle from './vehicle.js'

export default class Shift extends BaseModel {
  static table = 'shifts_mp'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'driver_id' })
  declare driverId: number

  @column({ columnName: 'vehicle_id' })
  declare vehicleId: number

  @column.date({ columnName: 'start_date' })
  declare startDate: DateTime

  @column.date({ columnName: 'end_date' })
  declare endDate: DateTime

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // Relación con Driver
  @belongsTo(() => Driver, {
    foreignKey: 'driverId',
  })
  declare driver: BelongsTo<typeof Driver>

  // Relación con Vehicle
  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
  })
  declare vehicle: BelongsTo<typeof Vehicle>
}
