// database/migrations/XXXX_create_fees_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fees'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Foreign key - Apunta a TripClient (la orden)
      table
        .integer('trip_client_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('trip_clients')
        .onDelete('CASCADE')

      // Número de cuota (1ra, 2da, 3ra, etc.)
      table
        .integer('installment_number')
        .unsigned()
        .notNullable()
        .defaultTo(1)
        .comment('Número de cuota dentro del plan de pagos')

      // Strict validations
      table.decimal('amount', 10, 2).unsigned().notNullable().checkPositive() // Positive amount
      table.string('description', 255).notNullable()
      table.dateTime('due_date').notNullable()
      table
        .enum('status', ['pending', 'paid', 'overdue', 'cancelled', 'refunded'])
        .notNullable()
        .defaultTo('pending')

      // Indexes
      table.index(['trip_client_id'])
      table.index(['trip_client_id', 'installment_number'])
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