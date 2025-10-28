import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vehicles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      table.string('license_plate').notNullable().unique()
      table.string('brand').notNullable()
      table.string('model').notNullable()
      table.integer('year').notNullable()
      table.string('color').notNullable()
      table.integer('capacity').notNullable()
      table.string('vehicle_type').notNullable()
      table.string('status').notNullable().defaultTo('available')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}