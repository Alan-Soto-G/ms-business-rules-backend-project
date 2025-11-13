import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activity_plan'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('tourist_activity_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tourist_activities')
        .onDelete('CASCADE')

      table
        .integer('plan_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('plans')
        .onDelete('CASCADE')

      // Evitar duplicados
      table.unique(['tourist_activity_id', 'plan_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
