import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'drivers_mp'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Referencia al user_id del microservicio de seguridad
      table.string('user_id').notNullable().unique()
      table.integer('experience_years').notNullable().defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
