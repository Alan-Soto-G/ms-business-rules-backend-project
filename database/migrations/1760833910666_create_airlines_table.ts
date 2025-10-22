import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'airlines'

  async up() {
    console.log('Creating table airlines...')
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable().comment('Airline name')
      table.string('code_iata', 2).notNullable().unique().comment('IATA code')
      table.string('code_icao', 3).notNullable().unique().comment('ICAO code')
      table.string('country_of_origin').notNullable().comment('Country of origin')
      table.integer('founding_year').nullable().comment('Year founded')
      table.boolean('is_active').defaultTo(true)

      // Contact
      table.string('address').nullable().comment('Airline address')
      table.string('phone').nullable().comment('Phone number')
      table.string('email').nullable().comment('Contact email')
      table.string('website').nullable().comment('Website')
      table.string('headquarter_city').nullable().comment('Headquarter city')
      table.string('ceo').nullable().comment('CEO')

      // Operations
      table.integer('aircraft_count').defaultTo(0).comment('Number of aircraft')
      table.json('aircraft_models').nullable().comment('Aircraft models')
      table.integer('number_destinations').defaultTo(0).comment('Number of destinations')
      table.json('main_hubs').nullable().comment('Main hubs (airport codes or names)')
      table.string('alliance').nullable().comment('Airline alliance (e.g. Star Alliance)')
      table.string('frequent_flyer_program').nullable().comment('Frequent flyer program name')

      // Service / reputation
      table
        .decimal('on_time_performance', 5, 2)
        .nullable()
        .comment('On-time performance percentage, e.g. 89.50')

      table.decimal('service_rating', 2, 1).defaultTo(0.0).comment('Service rating from 0.0 to 5.0')

      // Audit
      table.timestamp('created_at')
      table.timestamp('updated_at')

      console.log('Table airlines created.')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
