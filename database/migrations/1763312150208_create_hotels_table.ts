import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hotels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign keys
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

      // Strict validations for hotel data
      table.string('name', 150).notNullable()
      table.text('address').notNullable()
      table.string('phone', 20).notNullable().unique() // Unique phone
      table.string('email', 100).notNullable().unique() // Unique email
      table.integer('star_rating').unsigned().notNullable().defaultTo(0).checkBetween([0, 5]) // 0-5 stars
      table
        .enum('status', ['active', 'inactive', 'under_renovation'])
        .notNullable()
        .defaultTo('active')

      // Indexes
      table.index(['municipality_id'])
      table.index(['status'])
      table.index(['star_rating'])
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
