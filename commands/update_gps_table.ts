import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

export default class UpdateGpsTable extends BaseCommand {
  static commandName = 'update:gps'
  static description = 'Add location fields to GPS table'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    try {
      this.logger.info('Agregando columnas de ubicación a la tabla GPS...')
      
      await db.rawQuery(`
        ALTER TABLE gps
        ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
        ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
        ADD COLUMN IF NOT EXISTS speed DECIMAL(5, 2),
        ADD COLUMN IF NOT EXISTS last_location_update TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS connection_status TEXT DEFAULT 'offline'
          CHECK (connection_status IN ('online', 'offline', 'error'));
      `)
      
      this.logger.success('✅ Columnas agregadas exitosamente!')
      
      // Verificar que se agregaron
      const result = await db.rawQuery(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'gps'
        AND column_name IN ('latitude', 'longitude', 'speed', 'last_location_update', 'connection_status')
        ORDER BY ordinal_position
      `)
      
      this.logger.info('\nColumnas nuevas en la tabla GPS:')
      console.table(result.rows)
      
    } catch (error) {
      this.logger.error('❌ Error:', error.message)
      console.error(error)
    }
  }
}