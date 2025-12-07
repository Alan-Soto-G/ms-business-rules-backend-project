import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeUpdate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Fee from '#models/financial/fee'
import BankCard from '#models/financial/bank_card'
import notificationService from '#services/notification_service'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'fee_id' })
  declare feeId: number

  @column({ columnName: 'bank_card_id' })
  declare bankCardId: number 

  // Specific attributes of Invoice
  @column({ columnName: 'invoice_number' })
  declare invoiceNumber: string

  @column({ columnName: 'total_amount' })
  declare totalAmount: number

  @column.dateTime({ columnName: 'issue_date' })
  declare issueDate: DateTime

  @column.dateTime({ columnName: 'payment_date' })
  declare paymentDate: DateTime | null

  @column({ columnName: 'payment_method' })
  declare paymentMethod:
    | 'credit_card'
    | 'debit_card'
    | 'cash'
    | 'bank_transfer'
    | 'paypal'
    | 'other'

  // Relation 1 to 1 with Fee
  @belongsTo(() => Fee, {
    foreignKey: 'feeId',
  })
  declare fee: BelongsTo<typeof Fee>

  // Relation N to 1 with BankCard
  @belongsTo(() => BankCard, {
    foreignKey: 'bankCardId',
  })
  declare bankCard: BelongsTo<typeof BankCard>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  /**
   * Hook: Notifica automáticamente cuando se confirma un pago
   */
  @beforeUpdate()
  static async notifyPaymentConfirmed(invoice: Invoice) {
    // Solo notificar si se actualizó la fecha de pago (confirmación de pago)
    if (invoice.$dirty.paymentDate && invoice.paymentDate) {
      // Cargar relaciones necesarias
      await invoice.load('fee', (query) => {
        query.preload('trip')
      })

      // TODO: Obtener datos del cliente desde MS-security o Fee
      const clientName = 'Cliente' // Obtener del Fee o MS-security
      const clientEmail = 'cliente@placeholder.com' // Obtener del Fee o MS-security

      await notificationService.notifyPaymentAccepted({
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.totalAmount,
        paymentMethod: invoice.paymentMethod,
        clientName,
        clientEmail,
        tripId: invoice.fee.tripId,
        tripName: invoice.fee.trip.name,
      })
    }
  }
}
