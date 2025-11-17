import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transportation_services'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign keys
      table
        .integer('journey_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('journeys')
        .onDelete('CASCADE')

      table
        .integer('vehicle_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('vehicles')
        .onDelete('CASCADE')

      // Date and cost validations
      table.dateTime('start_date').notNullable()
      table.dateTime('end_date').notNullable()
      table.decimal('cost', 10, 2).unsigned().notNullable().checkPositive() // Positive cost

      // Indexes
      table.index(['journey_id'])
      table.index(['vehicle_id'])
      table.index(['start_date', 'end_date'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
