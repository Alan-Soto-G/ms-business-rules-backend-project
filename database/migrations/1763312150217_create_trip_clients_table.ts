import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'trip_clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Foreign keys
      table
        .integer('trip_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('trips')
        .onDelete('CASCADE')

      table
        .integer('client_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('clients')
        .onDelete('CASCADE')

      // Información de la reserva
      table.integer('travelers').unsigned().notNullable().defaultTo(1).comment('Número de viajeros')
      table.integer('quantity').unsigned().notNullable().defaultTo(1).comment('Cantidad de reservas')

      // Información de pago y cuotas
      table.integer('installments').unsigned().notNullable().defaultTo(1).comment('Número de cuotas (1 = contado)')
      table.decimal('total_amount', 12, 2).notNullable().comment('Monto total sin interés')
      table.decimal('total_with_interest', 12, 2).notNullable().comment('Monto total con interés')
      table.decimal('interest_rate', 5, 2).defaultTo(0).comment('Porcentaje de interés (%)')

      // Estado del pago
      table
        .enum('payment_status', [
          'pending',      // Orden creada, esperando pago
          'processing',   // Pago en proceso (ePayco procesando)
          'partial',      // Algunas cuotas pagadas (si aplica)
          'completed',    // Todas las cuotas pagadas
          'cancelled',    // Orden cancelada
          'refunded'      // Reembolsado
        ])
        .defaultTo('pending')
        .notNullable()

      // Referencia de ePayco
      table.string('epayco_ref', 100).nullable().comment('Referencia de transacción de ePayco')

      // Avoid Duplicates
      table.unique(['trip_id', 'client_id'])

      // Indexes
      table.index(['trip_id'])
      table.index(['client_id'])
      table.index(['payment_status'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}