// app/controllers/payments_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import TripClient from '#models/pivots/trip_client'
import Invoice from '#models/financial/invoice'
import BankCard from '#models/financial/bank_card'
import FeesService from '#services/financial/fees_service'
import { DateTime } from 'luxon'

export default class PaymentsController {
  private feesService: FeesService

  constructor() {
    this.feesService = new FeesService()
  }

  /**
   * POST /api/payment/confirmation
   * Webhook endpoint for ePayco payment confirmation
   */
  async confirmation({ request, response }: HttpContext) {
    try {
      const data = request.all()
      
      const x_ref_payco = data.x_ref_payco
      const x_transaction_id = data.x_transaction_id
      const x_amount = data.x_amount
      const x_transaction_state = data.x_transaction_state
      const x_response_reason_text = data.x_response_reason_text
      const x_franchise = data.x_franchise
      const x_extra1 = data.x_extra1
      const x_extra2 = data.x_extra2
      const x_extra3 = data.x_extra3

      const isAccepted = x_transaction_state === 'Aceptada' || 
                         data.x_response === 'Aceptada' ||
                         data.x_cod_transaction_state === '1'

      if (!isAccepted) {
        return response.ok({
          message: 'Payment not accepted',
          state: x_transaction_state,
          reason: x_response_reason_text,
        })
      }

      const tripClientId = parseInt(x_extra1)
      const installments = parseInt(x_extra2)
      const installmentNumber = parseInt(x_extra3)
      
      const tripClient = await TripClient.query()
        .where('id', tripClientId)
        .preload('client')
        .first()

      if (!tripClient) {
        return response.notFound({
          message: 'TripClient not found',
          success: false,
        })
      }

      const firstBankCard = await BankCard.query()
        .where('client_id', tripClient.clientId)
        .orderBy('created_at', 'asc')
        .first()

      if (installmentNumber === 1) {
        if (tripClient.epaycoRef === x_ref_payco) {
          await this.createInvoiceForInstallment(
            tripClient,
            installmentNumber,
            x_amount,
            x_franchise,
            firstBankCard?.id || null,
            x_ref_payco
          )
          
          return response.ok({
            message: 'Payment already processed',
            success: true,
            data: {
              tripClientId: tripClient.id,
              reference: x_ref_payco,
              transactionId: x_transaction_id,
            },
          })
        }

        tripClient.epaycoRef = x_ref_payco
        tripClient.installments = installments
        tripClient.totalWithInterest = parseFloat(x_amount) * installments
        tripClient.paymentStatus = installments === 1 ? 'completed' : 'partial'
        await tripClient.save()

        try {
          await this.feesService.createInstallmentsForTripClient(
            tripClient.id,
            parseFloat(x_amount) * installments,
            installments
          )
        } catch (feeError) {
          return response.internalServerError({
            message: 'Error creating installments',
            error: feeError.message,
          })
        }
      }

      try {
        await this.createInvoiceForInstallment(
          tripClient,
          installmentNumber,
          x_amount,
          x_franchise,
          firstBankCard?.id || null,
          x_ref_payco
        )
      } catch (invoiceError) {
        // Log error but don't fail the transaction
      }

      if (installmentNumber === installments) {
        tripClient.paymentStatus = 'completed'
        await tripClient.save()
      }

      return response.ok({
        message: 'Payment confirmed successfully',
        success: true,
        data: {
          tripClientId: tripClient.id,
          reference: x_ref_payco,
          transactionId: x_transaction_id,
          amount: x_amount,
          installments: installments,
          currentInstallment: installmentNumber,
          paymentStatus: tripClient.paymentStatus,
        },
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error processing payment confirmation',
        error: error.message,
      })
    }
  }

  /**
   * Crear factura para una cuota específica
   */
  private async createInvoiceForInstallment(
    tripClient: TripClient,
    installmentNumber: number,
    amount: string,
    franchise: string,
    bankCardId: number | null,
    epaycoRef: string
  ): Promise<Invoice> {
    const fees = await this.feesService.getInstallmentsByTripClient(tripClient.id)
    const currentFee = fees.find(fee => fee.installmentNumber === installmentNumber)

    if (!currentFee) {
      throw new Error(`No se encontró la cuota ${installmentNumber} para TripClient ${tripClient.id}`)
    }

    const existingInvoice = await Invoice.query()
      .where('fee_id', currentFee.id)
      .first()

    if (existingInvoice) {
      return existingInvoice
    }

    const paymentMethod = this.determinePaymentMethod(franchise)
    const invoiceNumber = this.generateInvoiceNumber(tripClient.id, installmentNumber)

    const invoice = await Invoice.create({
      feeId: currentFee.id,
      bankCardId: bankCardId ?? undefined,
      invoiceNumber: invoiceNumber,
      totalAmount: parseFloat(amount),
      issueDate: DateTime.now(),
      paymentDate: DateTime.now(),
      paymentMethod: paymentMethod,
    })

    return invoice
  }

  /**
   * Determinar método de pago basado en la franquicia
   */
  private determinePaymentMethod(franchise: string): 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'paypal' | 'other' {
    if (!franchise) return 'other'

    const franchiseLower = franchise.toLowerCase()

    if (franchiseLower.includes('visa') || 
        franchiseLower.includes('mastercard') || 
        franchiseLower.includes('amex') || 
        franchiseLower.includes('american express') ||
        franchiseLower.includes('diners')) {
      return 'credit_card'
    }

    if (franchiseLower.includes('pse')) {
      return 'bank_transfer'
    }

    return 'other'
  }

  /**
   * Generar número de factura único
   */
  private generateInvoiceNumber(tripClientId: number, installmentNumber: number): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `INV-${tripClientId}-${installmentNumber}-${timestamp}-${random}`
  }

  /**
   * GET /api/payment/status
   * Check payment status (llamado desde el frontend después del pago)
   */
  async status({ request, response }: HttpContext) {
    try {
      const { ref_payco } = request.qs()

      const tripClient = await TripClient.query()
        .where('epayco_ref', ref_payco)
        .preload('trip')
        .preload('client')
        .first()

      if (!tripClient) {
        return response.notFound({
          message: 'Payment not found',
          success: false,
        })
      }

      const fees = await this.feesService.getInstallmentsByTripClient(tripClient.id)

      let invoices: any[] = []
      
      if (fees.length > 0) {
        invoices = await Invoice.query()
          .whereIn('fee_id', fees.map(f => f.id))
          .preload('fee')
      }

      return response.ok({
        message: 'Payment status retrieved',
        success: true,
        data: {
          tripClient: tripClient,
          feesCreated: fees.length > 0,
          feesCount: fees.length,
          fees: fees,
          invoicesCreated: invoices.length > 0,
          invoicesCount: invoices.length,
          invoices: invoices,
        },
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error checking payment status',
        error: error.message,
      })
    }
  }
}