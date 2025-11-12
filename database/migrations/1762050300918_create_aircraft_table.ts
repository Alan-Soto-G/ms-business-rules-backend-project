import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'aircrafts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign key a vehicles (relación 1 a 1)
      table.integer('vehicle_id').unsigned().notNullable().unique()
      table.foreign('vehicle_id').references('id').inTable('vehicles').onDelete('CASCADE')

      // Foreign key a airlines (relación N a 1)
      table.integer('airline_id').unsigned().notNullable()
      table.foreign('airline_id').references('id').inTable('airlines').onDelete('CASCADE')

      // Atributos específicos de aeronave
      table.string('registration_country').notNullable()
      table.integer('max_altitude').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
