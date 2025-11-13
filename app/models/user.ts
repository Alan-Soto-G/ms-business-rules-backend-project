import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Client from './client.js'
import Guide from './guide.js'
import HotelAdmin from './hotel_admin.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'id_card' })
  declare idCard: string

  @column({ columnName: 'email' })
  declare email: string

  @column({ columnName: 'full_name' })
  declare fullName: string

  @column({ columnName: 'phone' })
  declare phone: string | null

  @column({ columnName: 'birth_date' })
  declare birthDate: DateTime | null

  @column({ columnName: 'address' })
  declare address: string | null

  @column({ columnName: 'user_type' })
  declare userType: 'guide' | 'client' | 'admin'

  @column({ columnName: 'status' })
  declare status: 'active' | 'inactive'

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // Relación 1 a 1 con Client
  @hasOne(() => Client, {
    foreignKey: 'userId',
  })
  declare client: HasOne<typeof Client>

  // Relación 1 a 1 con Guide
  @hasOne(() => Guide, {
    foreignKey: 'userId',
  })
  declare guide: HasOne<typeof Guide>

  // Relación 1 a 1 con HotelAdmin
  @hasOne(() => HotelAdmin, {
    foreignKey: 'userId',
  })
  declare hotelAdmin: HasOne<typeof HotelAdmin>
}
