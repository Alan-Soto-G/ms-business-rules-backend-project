import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign key a vehicles (relación 1 a 1)
      table.integer('vehicle_id').unsigned().notNullable().unique()
      table.foreign('vehicle_id').references('id').inTable('vehicles').onDelete('CASCADE')

      // Atributos básicos del GPS
      table.string('serial_number').notNullable().unique()
      table.string('brand').notNullable()
      table.string('model').notNullable()
      table.boolean('is_active').defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
