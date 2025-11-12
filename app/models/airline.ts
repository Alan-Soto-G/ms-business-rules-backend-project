import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Aircraft from './aircraft.js'

export default class Airline extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'code_iata' })
  declare codeIata: string

  @column({ columnName: 'code_icao' })
  declare codeIcao: string

  @column({ columnName: 'country_of_origin' })
  declare countryOfOrigin: string

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  // Relación 1 a N con Aircraft
  @hasMany(() => Aircraft)
  declare aircrafts: HasMany<typeof Aircraft>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
