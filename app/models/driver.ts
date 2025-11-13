import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Vehicle from './vehicle.js'
import Shift from './shift.js'

export default class Driver extends BaseModel {
  static table = 'drivers_mp'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: string // Referencia al _id del User en el MS de seguridad

  @column({ columnName: 'experience_years' })
  declare experienceYears: number

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // Relación N:M con Vehicle a través de Shift
  @manyToMany(() => Vehicle, {
    pivotTable: 'shifts_mp',
    localKey: 'id',
    pivotForeignKey: 'driver_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'vehicle_id',
    pivotColumns: ['start_date', 'end_date'],
  })
  declare vehicles: ManyToMany<typeof Vehicle>
}
