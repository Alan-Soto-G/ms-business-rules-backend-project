import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Referencia al user_id del MS de seguridad (sin foreign key)
      table.integer('user_id').unsigned().notNullable().unique()

      table.string('emergency_contact_name').nullable()
      table.string('emergency_contact_phone').nullable()
      table.text('allergies').nullable()
      table.integer('loyalty_points').defaultTo(0)
      table.boolean('is_vip').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
