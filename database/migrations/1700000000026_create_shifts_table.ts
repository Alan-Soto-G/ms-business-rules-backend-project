import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shifts_mp'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('driver_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('drivers_mp')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('vehicle_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('vehicles')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.date('start_date').notNullable()
      table.date('end_date').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Índice único para evitar duplicados
      table.unique(['driver_id', 'vehicle_id', 'start_date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
