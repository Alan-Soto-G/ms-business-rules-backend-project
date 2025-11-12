// database/migrations/XXXX_create_bank_cards_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bank_cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('client_id').unsigned().references('clients.id').onDelete('CASCADE')
      table.string('card_number', 16).notNullable()
      table.string('cvv', 4).notNullable()
      table.dateTime('expiration_date').notNullable()
      table.string('card_holder_name', 255).notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}