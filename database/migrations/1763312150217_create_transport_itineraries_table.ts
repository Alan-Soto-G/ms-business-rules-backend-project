import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transport_itineraries'

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
        .integer('trip_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('trips')
        .onDelete('CASCADE')

      table
        .integer('transportation_service_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('transportation_services')
        .onDelete('CASCADE')

      // Order validation
      table.integer('order').unsigned().notNullable().checkPositive() // Positive order

      // Validate that there are no duplicate orders in the same trip
      table.unique(['trip_id', 'order'])

      // Indexes
      table.index(['trip_id', 'order'])
      table.index(['transportation_service_id'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
