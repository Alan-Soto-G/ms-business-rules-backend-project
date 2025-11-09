// database/migrations/XXXX_create_fees_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fees'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('trip_id').unsigned().references('trips.id').onDelete('CASCADE')
      table.decimal('amount', 10, 2).notNullable()
      table.string('description', 255).notNullable()
      table.dateTime('due_date').notNullable()
      table.string('status', 50).notNullable().defaultTo('pending')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}