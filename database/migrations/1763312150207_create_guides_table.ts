import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'guides'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // user_id comes from the security microservice (ms-security)
      table.string('user_id', 100).notNullable().unique()

      // Strict validations
      table.string('license_number', 50).notNullable().unique() // Unique license
      table.text('specialties').nullable()
      table.decimal('rating', 3, 2).notNullable().defaultTo(0).checkBetween([0, 5]) // Rating 0-5
      table.boolean('is_available').notNullable().defaultTo(true)

      // Indexes
      table.index(['is_available'])
      table.index(['rating'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
