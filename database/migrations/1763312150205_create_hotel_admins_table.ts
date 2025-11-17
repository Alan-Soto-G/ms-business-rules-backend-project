import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hotel_admins'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // user_id comes from the security microservice (ms-security)
      table.string('user_id', 100).notNullable().unique()

      table.boolean('is_verified').notNullable().defaultTo(false)

      // Indexes
      table.index(['is_verified'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
