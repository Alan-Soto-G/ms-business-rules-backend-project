import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign Key to vehicles (1 to 1 relationship)
      table
        .integer('vehicle_id')
        .unsigned()
        .notNullable()
        .unique()
        .references('id')
        .inTable('vehicles')
        .onDelete('CASCADE')

      // Specific attributes
      table.string('serial_number').notNullable().unique()
      table.string('brand').notNullable()
      table.string('model').notNullable()
      table.boolean('is_active').defaultTo(true)

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
