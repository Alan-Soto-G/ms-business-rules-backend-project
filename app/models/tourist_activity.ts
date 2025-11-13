import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Municipality from './municipality.js'
import Guide from './guide.js'
import Plan from './plan.js'

export default class TouristActivity extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'municipality_id' })
  declare municipalityId: number

  @column({ columnName: 'name' })
  declare name: string

  @column({ columnName: 'description' })
  declare description: string | null

  @column({ columnName: 'price' })
  declare price: number | null

  @column({ columnName: 'duration' })
  declare duration: number | null

  @column({ columnName: 'category' })
  declare category: 'cultural' | 'adventure' | 'gastronomic' | 'recreational' | 'other'

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // Relación N a 1 con Municipality
  @belongsTo(() => Municipality, {
    foreignKey: 'municipalityId',
  })
  declare municipality: BelongsTo<typeof Municipality>

  // Relación N a N con Guide
  @manyToMany(() => Guide, {
    pivotTable: 'guide_tourist_activity',
    localKey: 'id',
    pivotForeignKey: 'tourist_activity_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'guide_id',
  })
  declare guides: ManyToMany<typeof Guide>

  // Relación N a N con Plan
  @manyToMany(() => Plan, {
    pivotTable: 'activity_plan',
    localKey: 'id',
    pivotForeignKey: 'tourist_activity_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'plan_id',
  })
  declare plans: ManyToMany<typeof Plan>
}
