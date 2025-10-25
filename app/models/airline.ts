import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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

  @column({ columnName: 'founding_year' })
  declare foundingYear?: number | null

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  // Contact
  @column({ columnName: 'address' })
  declare address?: string | null

  @column({ columnName: 'phone' })
  declare phone?: string | null

  @column({ columnName: 'email' })
  declare email?: string | null

  @column({ columnName: 'website' })
  declare website?: string | null

  @column({ columnName: 'headquarter_city' })
  declare headquarterCity?: string | null

  @column({ columnName: 'ceo' })
  declare ceo?: string | null

  // Operations
  @column({ columnName: 'aircraft_count' })
  declare aircraftCount: number

  @column({ columnName: 'aircraft_models' })
  // Postgres returns JSON arrays directly; use string[] for type safety
  declare aircraftModels?: string[] | null

  @column({ columnName: 'number_destinations' })
  declare numberDestinations: number

  @column({ columnName: 'main_hubs' })
  declare mainHubs?: string[] | null

  @column({ columnName: 'alliance' })
  declare alliance?: string | null

  @column({ columnName: 'frequent_flyer_program' })
  declare frequentFlyerProgram?: string | null

  // Service / reputation
  @column({ columnName: 'on_time_performance' })
  declare onTimePerformance?: number | null

  @column({ columnName: 'service_rating' })
  declare serviceRating: number

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
