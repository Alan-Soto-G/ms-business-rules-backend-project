// database/migrations/XXXX_create_invoices_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'invoices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('fee_id').unsigned().references('fees.id').onDelete('CASCADE')
      table
        .integer('bank_card_id')
        .unsigned()
        .references('bank_cards.id')
        .onDelete('SET NULL')
        .nullable()
      table.string('invoice_number', 50).notNullable().unique()
      table.decimal('total_amount', 10, 2).notNullable()
      table.dateTime('issue_date').notNullable()
      table.dateTime('payment_date').nullable()
      table.string('payment_method', 50).notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
