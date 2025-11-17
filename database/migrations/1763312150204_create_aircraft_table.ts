import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aircrafts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign key to vehicles (1 to 1 relationship)
      table
        .integer('vehicle_id')
        .unsigned()
        .notNullable()
        .unique()
        .references('id')
        .inTable('vehicles')
        .onDelete('CASCADE')

      // Foreign key to airlines (N to 1 relationship)
      table
        .integer('airline_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('airlines')
        .onDelete('CASCADE')

      // Specific attributes with validations
      table.string('registration_country', 100).notNullable()
      table.integer('max_altitude').unsigned().nullable().checkBetween([0, 60000]) // Meters, realistic limit

      // Indexes
      table.index(['airline_id'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
