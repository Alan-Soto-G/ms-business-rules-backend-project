// database/migrations/XXXX_create_bank_cards_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bank_cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('client_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('clients')
        .onDelete('CASCADE')

      // Strict validations for bank data
      table.string('card_number', 19).notNullable() // Includes spaces, max 19 chars
      table.string('cvv', 4).notNullable() // CVV of 3-4 digits
      table.dateTime('expiration_date').notNullable()
      table.string('card_holder_name', 100).notNullable()

      // Indexes
      table.index(['client_id'])
      table.index(['expiration_date']) // To detect expired cards

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
