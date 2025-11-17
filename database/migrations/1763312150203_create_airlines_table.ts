import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'airlines'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Strict validations
      table.string('name', 100).notNullable()
      table.string('code_iata', 2).notNullable().unique() // 2-letter IATA code
      table.string('code_icao', 3).notNullable().unique() // 3-letter ICAO code
      table.string('country_of_origin', 100).notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)

      // Indexes
      table.index(['is_active'])
      table.index(['name'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
