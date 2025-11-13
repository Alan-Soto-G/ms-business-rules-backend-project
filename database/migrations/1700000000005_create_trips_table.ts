import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'trips'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Atributos principales
      table.dateTime('start_date').notNullable()
      table.dateTime('end_date').notNullable()
      table.string('destination', 255).notNullable()
      table.string('name', 255).notNullable()
      table.text('description').nullable()
      table.decimal('price', 10, 2).notNullable().defaultTo(0)
      table.integer('capacity').unsigned().notNullable().defaultTo(0)
      table.integer('available_seats').unsigned().notNullable().defaultTo(0)
      table.string('status', 50).notNullable().defaultTo('active')

      // Auditoría
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
