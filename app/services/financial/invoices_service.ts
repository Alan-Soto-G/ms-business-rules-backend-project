import Invoice from '#models/financial/invoice'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

export default class InvoicesService {
  /**
   * Get all invoices with optional pagination
   */
  async getAllInvoices(
    page?: number,
    limit?: number
  ): Promise<Invoice[] | ModelPaginatorContract<Invoice>> {
    const query = Invoice.query().preload('fee').orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(id: number): Promise<Invoice | null> {
    return await Invoice.query().where('id', id).preload('fee').first()
  }

  /**
   * Create new invoice
   */
  async createInvoice(data: {
    feeId: number
    bankCardId?: number | null
    invoiceNumber: string
    totalAmount: number
    issueDate: DateTime
    paymentDate?: DateTime | null
    paymentMethod?: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'paypal' | 'other'
  }): Promise<Invoice> {
    const invoice = await Invoice.create(data)
    await invoice.load('fee')
    return invoice
  }

  /**
   * Update invoice
   */
  async updateInvoice(
    id: number,
    data: {
      feeId?: number
      bankCardId?: number | null
      invoiceNumber?: string
      totalAmount?: number
      issueDate?: DateTime
      paymentDate?: DateTime | null
      paymentMethod?: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'paypal' | 'other'
    }
  ): Promise<Invoice | null> {
    const invoice = await Invoice.find(id)

    if (!invoice) {
      return null
    }

    invoice.merge(data)
    await invoice.save()
    await invoice.load('fee')

    return invoice
  }

  /**
   * Delete invoice
   */
  async deleteInvoice(id: number): Promise<boolean> {
    const invoice = await Invoice.find(id)

    if (!invoice) {
      return false
    }

    await invoice.delete()
    return true
  }
}
