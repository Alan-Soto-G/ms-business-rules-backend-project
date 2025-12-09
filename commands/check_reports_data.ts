import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Trip from '#models/core/trip'
import TransportationService from '#models/transportation/transportation_service'
import Database from '@adonisjs/lucid/services/db'

export default class CheckReportsData extends BaseCommand {
  static commandName = 'check:reports-data'
  static description = 'Check if there is data for reports'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Checking reports data...')

    try {
      // Check trips
      const totalTrips = await Trip.query().count('* as total')
      const validTrips = await Trip.query()
        .whereNotIn('status', ['draft', 'cancelled'])
        .count('* as total')

      this.logger.info(`Total trips: ${totalTrips[0].$extras.total}`)
      this.logger.info(`Valid trips (not draft/cancelled): ${validTrips[0].$extras.total}`)

      // Check trip statuses
      const tripsByStatus = await Trip.query()
        .select('status')
        .count('* as total')
        .groupBy('status')

      this.logger.info('\nTrips by status:')
      for (const row of tripsByStatus) {
        this.logger.info(`  ${row.status}: ${row.$extras.total}`)
      }

      // Check transport itineraries
      const itineraries = await Database.from('transport_itineraries').count('* as total')
      this.logger.info(`\nTotal transport itineraries: ${itineraries[0].total}`)

      // Check journeys
      const journeys = await Database.from('journeys').count('* as total')
      this.logger.info(`Total journeys: ${journeys[0].total}`)

      // Check municipalities
      const municipalities = await Database.from('municipalities').count('* as total')
      this.logger.info(`Total municipalities: ${municipalities[0].total}`)

      // Check transport services and vehicles
      const transportServices = await TransportationService.query().count('* as total')
      this.logger.info(`\nTotal transport services: ${transportServices[0].$extras.total}`)

      const vehicles = await Database.from('vehicles').count('* as total')
      this.logger.info(`Total vehicles: ${vehicles[0].total}`)

      // Try the municipality trips query
      this.logger.info('\nTesting municipality trips query...')
      try {
        const result = await Database.from('transport_itineraries as ti')
          .innerJoin('journeys as j', 'ti.journey_id', 'j.id')
          .innerJoin('municipalities as m', 'j.destination_municipality_id', 'm.id')
          .innerJoin('trips as t', 'ti.trip_id', 't.id')
          .whereNotIn('t.status', ['draft', 'cancelled'])
          .select('m.id as municipalityId', 'm.name as municipalityName')
          .count('DISTINCT t.id as tripCount')
          .groupBy('m.id', 'm.name')
          .orderBy('tripCount', 'desc')

        this.logger.info(`Municipality trips query successful: ${result.length} results`)
      } catch (error) {
        this.logger.error('Municipality trips query failed:', error.message)
      }

      this.logger.success('Data check complete')
    } catch (error) {
      this.logger.error('Error checking data:', error.message)
      this.logger.error(error.stack)
    }
  }
}
