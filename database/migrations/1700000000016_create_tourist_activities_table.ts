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

      table.string('name').notNullable()
      table.text('description').nullable()
      table.decimal('price', 10, 2).nullable()
      table.integer('duration').nullable().comment('Duración en horas')
      table
        .enum('category', ['cultural', 'adventure', 'gastronomic', 'recreational', 'other'])
        .defaultTo('other')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
