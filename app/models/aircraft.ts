import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Vehicle from './vehicle.js'
import Airline from './airline.js'

export default class Aircraft extends BaseModel {
  static table = 'aircrafts'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'vehicle_id' })
  declare vehicleId: number

  @column({ columnName: 'airline_id' })
  declare airlineId: number

  // Atributos específicos de aeronave
  @column({ columnName: 'registration_country' })
  declare registrationCountry: string

  @column({ columnName: 'max_altitude' })
  declare maxAltitude: number | null

  // Relación 1 a 1 con Vehicle
  @belongsTo(() => Vehicle)
  declare vehicle: BelongsTo<typeof Vehicle>

  // Relación N a 1 con Airline
  @belongsTo(() => Airline)
  declare airline: BelongsTo<typeof Airline>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
