import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'guide_activities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign keys
      table
        .integer('guide_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('guides')
        .onDelete('CASCADE')

      table
        .integer('activity_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tourist_activities')
        .onDelete('CASCADE')

      // Specific attributes with Guide Activity
      table.dateTime('assignment_date').notNullable()

      // Avoid Duplicates
      table.unique(['guide_id', 'activity_id'])

      // Indexes
      table.index(['guide_id'])
      table.index(['activity_id'])
      table.index(['assignment_date'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
