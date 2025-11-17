import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'journeys'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign keys to municipalities (self-referencing for origin and destination)
      table
        .integer('origin_municipality_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('municipalities')
        .onDelete('RESTRICT')

      table
        .integer('destination_municipality_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('municipalities')
        .onDelete('RESTRICT')

      // Validations
      table.decimal('distance', 10, 2).unsigned().nullable().checkBetween([0, 50000]) // Distance in km, maximum 50,000 km

      // Indexes
      table.index(['origin_municipality_id'])
      table.index(['destination_municipality_id'])
      table.index(['origin_municipality_id', 'destination_municipality_id'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
