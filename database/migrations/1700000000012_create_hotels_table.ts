import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hotels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('hotel_admin_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('hotel_admins')
        .onDelete('CASCADE')

      table
        .integer('municipality_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('municipalities')
        .onDelete('RESTRICT')

      table.string('name').notNullable()
      table.text('address').notNullable()
      table.string('phone').notNullable()
      table.string('email').notNullable()
      table.integer('star_rating').unsigned().defaultTo(0)
      table.enum('status', ['active', 'inactive']).defaultTo('active')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
