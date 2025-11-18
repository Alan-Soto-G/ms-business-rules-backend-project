import type { HttpContext } from '@adonisjs/core/http'
import InvoicesService from '#services/financial/invoices_service'
import { createInvoiceValidator, updateInvoiceValidator } from '#validators/financial/invoice'

export default class InvoicesController {
  private invoicesService: InvoicesService

  constructor() {
    this.invoicesService = new InvoicesService()
  }

  /**
   * GET /invoices
   * Get all invoices with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const invoices = await this.invoicesService.getAllInvoices(page, limit)

      return response.ok({
        message: 'Invoices retrieved successfully',
        data: invoices,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving invoices',
        error: error.message,
      })
    }
  }

  /**
   * GET /invoices/:id
   * Get invoice by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const invoice = await this.invoicesService.getInvoiceById(params.id)

      if (!invoice) {
        return response.notFound({
          message: 'Invoice not found',
        })
      }

      return response.ok({
        message: 'Invoice retrieved successfully',
        data: invoice,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving invoice',
        error: error.message,
      })
    }
  }

  /**
   * POST /invoices
   * Create new invoice
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createInvoiceValidator)

      const invoice = await this.invoicesService.createInvoice(data)

      return response.created({
        message: 'Invoice created successfully',
        data: invoice,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.code === '23505') {
        return response.conflict({
          message: 'Invoice number or fee ID already exists',
        })
      }

      if (error.code === '23503') {
        return response.notFound({
          message: 'Fee or bank card not found',
        })
      }

      return response.internalServerError({
        message: 'Error creating invoice',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /invoices/:id
   * Update invoice
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateInvoiceValidator)

      const invoice = await this.invoicesService.updateInvoice(params.id, data)

      if (!invoice) {
        return response.notFound({
          message: 'Invoice not found',
        })
      }

      return response.ok({
        message: 'Invoice updated successfully',
        data: invoice,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.code === '23505') {
        return response.conflict({
          message: 'Invoice number or fee ID already exists',
        })
      }

      if (error.code === '23503') {
        return response.notFound({
          message: 'Fee or bank card not found',
        })
      }

      return response.internalServerError({
        message: 'Error updating invoice',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /invoices/:id
   * Delete invoice
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.invoicesService.deleteInvoice(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Invoice not found',
        })
      }

      return response.ok({
        message: 'Invoice deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting invoice',
        error: error.message,
      })
    }
  }
}
