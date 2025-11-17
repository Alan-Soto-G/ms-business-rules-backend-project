import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plan_activities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign keys
      table
        .integer('plan_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('plans')
        .onDelete('CASCADE')

      table
        .integer('activity_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tourist_activities')
        .onDelete('CASCADE')

      // Validations
      table.integer('order').unsigned().notNullable().checkPositive() // Positive order in the plan

      // Avoid Duplicates of activity in the same plan
      table.unique(['plan_id', 'activity_id'])
      // Avoid Duplicates of order in the same plan
      table.unique(['plan_id', 'order'])

      // Indexes
      table.index(['plan_id', 'order'])
      table.index(['activity_id'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
