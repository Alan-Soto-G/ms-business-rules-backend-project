// commands/check_tables.ts
import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'

export default class CheckTables extends BaseCommand {
  static commandName = 'check:tables'
  static description = 'Revisar estructura de las tablas'

  async run() {
    this.logger.info('Revisando estructura de tablas...\n')

    await this.checkTable('fees')
    await this.checkTable('trip_clients')
    await this.checkTable('invoices')
  }

  private async checkTable(tableName: string) {
    try {
      const result = await db.rawQuery(`
        SELECT 
          column_name AS "Columna",
          data_type AS "Tipo",
          character_maximum_length AS "Longitud",
          is_nullable AS "Nullable",
          column_default AS "Default"
        FROM information_schema.columns
        WHERE table_name = '${tableName}'
        ORDER BY ordinal_position
      `)

      if (!result.rows || result.rows.length === 0) {
        this.logger.warning(`❌ La tabla "${tableName}" no existe\n`)
        return
      }

      this.logger.success(`✅ Tabla: ${tableName.toUpperCase()}`)
      console.table(result.rows)
      console.log('\n')

    } catch (error) {
      this.logger.error(`Error en tabla ${tableName}: ${error.message}`)
    }
  }
}