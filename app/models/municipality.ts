import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Municipality extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'department' })
  declare department: string

  @column({ columnName: 'code' })
  declare code: string

  // Relación N a N reflexiva - municipios de origen
  @manyToMany(() => Municipality, {
    pivotTable: 'itineraries',
    localKey: 'id',
    pivotForeignKey: 'origin_municipality_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'destination_municipality_id',
  })
  declare destinations: ManyToMany<typeof Municipality>

  // Relación N a N reflexiva - municipios de destino
  @manyToMany(() => Municipality, {
    pivotTable: 'itineraries',
    localKey: 'id',
    pivotForeignKey: 'destination_municipality_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'origin_municipality_id',
  })
  declare origins: ManyToMany<typeof Municipality>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}
