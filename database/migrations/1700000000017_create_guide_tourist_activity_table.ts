import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'guide_tourist_activities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('guide_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('guides')
        .onDelete('CASCADE')

      table
        .integer('tourist_activity_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tourist_activities')
        .onDelete('CASCADE')

      // Evitar duplicados
      table.unique(['guide_id', 'tourist_activity_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
