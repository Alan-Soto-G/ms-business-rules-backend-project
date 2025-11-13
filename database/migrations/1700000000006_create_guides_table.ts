import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'guides'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Referencia al user_id del MS de seguridad (sin foreign key)
      table.integer('user_id').unsigned().notNullable().unique()

      table.string('license_number').notNullable().unique()
      table.text('specialties').nullable()
      table.decimal('rating', 3, 2).defaultTo(0)
      table.boolean('is_available').defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
