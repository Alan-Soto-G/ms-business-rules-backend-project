// database/migrations/XXXX_create_invoices_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'invoices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('fee_id')
        .unsigned()
        .notNullable()
        .unique() // One invoice per fee (1-1 relationship)
        .references('id')
        .inTable('fees')
        .onDelete('CASCADE')

      table
        .integer('bank_card_id')
        .unsigned()
        .references('id')
        .inTable('bank_cards')
        .onDelete('SET NULL')
        .nullable()

      // Strict validations
      table.string('invoice_number', 50).notNullable().unique() // Unique invoice number
      table.decimal('total_amount', 10, 2).unsigned().notNullable().checkPositive() // Positive amount
      table.dateTime('issue_date').notNullable()
      table.dateTime('payment_date').nullable()
      table
        .enum('payment_method', [
          'credit_card',
          'debit_card',
          'cash',
          'bank_transfer',
          'paypal',
          'other',
        ])
        .notNullable()

      // Indexes
      table.index(['fee_id'])
      table.index(['issue_date'])
      table.index(['payment_method'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
