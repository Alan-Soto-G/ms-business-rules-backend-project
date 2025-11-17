import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vehicles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Strict validations
      table.string('license_plate', 20).notNullable().unique() // Unique license plate
      table.string('brand', 50).notNullable()
      table.string('model', 50).notNullable()
      table.integer('year').unsigned().notNullable().checkBetween([1900, 2100]) // Valid year
      table.string('color', 30).notNullable()
      table.integer('number_of_seats').unsigned().notNullable().checkBetween([1, 100]) // Reasonable capacity
      table.string('vehicle_type', 50).notNullable() // car, bus, aircraft, etc
      table
        .enum('status', ['available', 'in_use', 'maintenance', 'retired'])
        .notNullable()
        .defaultTo('available')

      // Indexes
      table.index(['status'])
      table.index(['vehicle_type'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
