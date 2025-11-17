import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'trip_plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign keys
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

      // Avoid Duplicates
      table.unique(['trip_id', 'plan_id'])

      // Indexes
      table.index(['trip_id'])
      table.index(['plan_id'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
