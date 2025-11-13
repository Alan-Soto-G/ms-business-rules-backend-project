import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('id_card').unique().notNullable()
      table.string('email').unique().notNullable()
      table.string('full_name').notNullable()
      table.string('phone').nullable()
      table.date('birth_date').nullable()
      table.text('address').nullable()
      table.enum('user_type', ['guide', 'client', 'admin']).notNullable()
      table.enum('status', ['active', 'inactive']).defaultTo('active')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
