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
      table.string('room_number').notNullable()
      table.string('room_type').notNullable()
      table.integer('capacity').unsigned().notNullable()
      table.decimal('price_per_night', 10, 2).notNullable()
      table.enum('status', ['available', 'occupied', 'maintenance']).defaultTo('available')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
