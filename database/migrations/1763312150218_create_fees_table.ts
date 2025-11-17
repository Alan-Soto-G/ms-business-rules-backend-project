// database/migrations/XXXX_create_fees_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fees'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('trip_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('trips')
        .onDelete('CASCADE')

      // Strict validations
      table.decimal('amount', 10, 2).unsigned().notNullable().checkPositive() // Positive amount
      table.string('description', 255).notNullable()
      table.dateTime('due_date').notNullable()
      table
        .enum('status', ['pending', 'paid', 'overdue', 'cancelled', 'refunded'])
        .notNullable()
        .defaultTo('pending')

      // Indexes
      table.index(['trip_id'])
      table.index(['status'])
      table.index(['due_date'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
