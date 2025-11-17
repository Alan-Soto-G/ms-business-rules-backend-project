import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Vehicle from '#models/transportation/vehicle'
import Airline from '#models/transportation/airline'

export default class Aircraft extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'vehicle_id' })
  declare vehicleId: number

  @column({ columnName: 'airline_id' })
  declare airlineId: number

  // Specific attributes of Aircraft
  @column({ columnName: 'registration_country' })
  declare registrationCountry: string

  @column({ columnName: 'max_altitude' })
  declare maxAltitude: number | null

  // Relation 1 to 1 with Vehicle
  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
  })
  declare vehicle: BelongsTo<typeof Vehicle>

  // Relation N to 1 with Airline
  @belongsTo(() => Airline, {
    foreignKey: 'airlineId',
  })
  declare airline: BelongsTo<typeof Airline>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
