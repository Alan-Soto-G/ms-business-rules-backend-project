import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'trip_plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('trip_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('trips')
        .onDelete('CASCADE')

      table
        .integer('plan_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('plans')
        .onDelete('CASCADE')

      // Evitar duplicados
      table.unique(['trip_id', 'plan_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
