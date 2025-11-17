import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Strict validations
      table.string('name', 150).notNullable()
      table.text('description').nullable()
      table.decimal('price', 10, 2).unsigned().notNullable().checkPositive() // Positive price
      table.integer('duration').unsigned().nullable().checkBetween([1, 365]) // Duration in days 1-365

      // Indexes
      table.index(['price'])
      table.index(['duration'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
