import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Vehicle from '#models/vehicle'

export default class Gps extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'vehicle_id' })
  declare vehicleId: number

  // Specific attributes of Gps
  @column({ columnName: 'serial_number' })
  declare serialNumber: string

  @column({ columnName: 'brand' })
  declare brand: string

  @column({ columnName: 'model' })
  declare model: string

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  // Relation 1 to 1 with Vehicle
  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
  })
  declare vehicle: BelongsTo<typeof Vehicle>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
