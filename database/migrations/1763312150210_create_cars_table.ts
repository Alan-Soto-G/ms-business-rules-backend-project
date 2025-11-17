import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cars'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign keys
      table
        .integer('vehicle_id')
        .unsigned()
        .notNullable()
        .unique()
        .references('id')
        .inTable('vehicles')
        .onDelete('CASCADE')
      table
        .integer('hotel_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('hotels')
        .onDelete('CASCADE')

      // Specific validations
      table.enum('fuel_type', ['gasoline', 'diesel', 'electric', 'hybrid', 'lpg']).notNullable()
      table.enum('transmission_type', ['manual', 'automatic', 'cvt']).notNullable()

      // Indexes
      table.index(['hotel_id'])
      table.index(['fuel_type'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
