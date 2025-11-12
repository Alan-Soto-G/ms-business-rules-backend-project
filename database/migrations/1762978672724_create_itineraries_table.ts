import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'itineraries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign keys para la relación N a N reflexiva
      table.integer('origin_municipality_id').unsigned().notNullable()
      table
        .foreign('origin_municipality_id')
        .references('id')
        .inTable('municipalities')
        .onDelete('CASCADE')

      table.integer('destination_municipality_id').unsigned().notNullable()
      table
        .foreign('destination_municipality_id')
        .references('id')
        .inTable('municipalities')
        .onDelete('CASCADE')

      // Evitar duplicados de la misma ruta
      table.unique(['origin_municipality_id', 'destination_municipality_id'])

      // Atributos adicionales del itinerario
      table.decimal('distance', 10, 2).nullable()
      table.integer('estimated_time').nullable().comment('Tiempo estimado en minutos')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
