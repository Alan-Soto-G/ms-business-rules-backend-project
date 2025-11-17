import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('hotel_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('hotels')
        .onDelete('CASCADE')

      // Strict validations
      table.string('room_number', 20).notNullable()
      table.string('room_type', 50).notNullable() // single, double, suite, etc
      table.integer('capacity').unsigned().notNullable().checkBetween([1, 20]) // Reasonable capacity
      table.decimal('price_per_night', 10, 2).unsigned().notNullable().checkPositive() // Positive price
      table
        .enum('status', ['available', 'occupied', 'maintenance', 'cleaning'])
        .notNullable()
        .defaultTo('available')

      // Unique room number per hotel
      table.unique(['hotel_id', 'room_number'])

      // Indexes
      table.index(['hotel_id', 'status'])
      table.index(['room_type'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
