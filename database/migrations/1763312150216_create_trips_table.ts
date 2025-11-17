import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'trips'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Date validations
      table.dateTime('start_date').notNullable()
      table.dateTime('end_date').notNullable()

      // Strict validations
      table.string('destination', 150).notNullable()
      table.string('name', 150).notNullable()
      table.text('description').nullable()
      table.decimal('price', 10, 2).unsigned().notNullable().checkPositive() // Positive price
      table.integer('capacity').unsigned().notNullable().checkBetween([1, 500]) // Reasonable capacity
      table.integer('available_seats').unsigned().notNullable()
      table
        .enum('status', ['draft', 'published', 'active', 'full', 'completed', 'cancelled'])
        .notNullable()
        .defaultTo('draft')

      // Indexes
      table.index(['status'])
      table.index(['start_date', 'end_date'])
      table.index(['destination'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
