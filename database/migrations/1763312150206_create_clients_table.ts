import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // user_id comes from the security microservice (ms-security)
      table.string('user_id', 100).notNullable().unique()

      // Validations for emergency contacts
      table.string('emergency_contact_name', 100).nullable()
      table.string('emergency_contact_phone', 20).nullable()
      table.text('allergies').nullable()
      table.integer('loyalty_points').unsigned().notNullable().defaultTo(0).checkPositive()
      table.boolean('is_vip').notNullable().defaultTo(false)

      // Indexes for frequent queries
      table.index(['is_vip'])
      table.index(['loyalty_points'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
