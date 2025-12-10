import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gps'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Coordenadas GPS
      table.decimal('latitude', 10, 8).nullable() // Ej: -5.06889800
      table.decimal('longitude', 11, 8).nullable() // Ej: -75.51738700
      
      // Velocidad actual en km/h (opcional)
      table.decimal('speed', 5, 2).nullable() // Ej: 65.50
      
      // Timestamp de la última actualización de ubicación
      table.timestamp('last_location_update', { useTz: true }).nullable()
      
      // Estado de conexión del GPS
      table.enum('connection_status', ['online', 'offline', 'error']).defaultTo('offline')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('latitude')
      table.dropColumn('longitude')
      table.dropColumn('speed')
      table.dropColumn('last_location_update')
      table.dropColumn('connection_status')
    })
  }
}