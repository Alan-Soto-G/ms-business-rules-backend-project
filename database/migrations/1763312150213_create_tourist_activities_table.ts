import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tourist_activities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('municipality_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('municipalities')
        .onDelete('RESTRICT')

      // Strict validations
      table.string('name', 150).notNullable()
      table.text('description').nullable()
      table.decimal('price', 10, 2).unsigned().nullable().checkPositive() // Positive price if exists
      table.integer('duration').unsigned().nullable().checkBetween([1, 480]) // Duration in hours 1-480 (20 days)
      table
        .enum('category', [
          'cultural',
          'adventure',
          'gastronomic',
          'recreational',
          'ecological',
          'aquatic',
          'other',
        ])
        .notNullable()
        .defaultTo('other')

      // Indexes
      table.index(['municipality_id'])
      table.index(['category'])
      table.index(['price'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
