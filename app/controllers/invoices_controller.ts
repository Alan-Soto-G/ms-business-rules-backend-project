// ============================================
// CONTROLADOR: app/controllers/invoices_controller.ts
// ============================================
import type { HttpContext } from '@adonisjs/core/http'
import Invoice from '#models/invoice'
import { createInvoiceValidator, updateInvoiceValidator } from '#validators/invoice'
import { DateTime } from 'luxon'

export default class InvoicesController {

  // GET ALL
  public async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 20)
    const invoices = await Invoice.query().paginate(page, perPage)
    return response.ok(invoices)
  }

  // GET BY ID
  public async show({ params, response }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    await invoice.load('fee')
    return response.ok(invoice)
  }

  // CREATE
  public async store({ request, response }: HttpContext) {
    const body = await request.validateUsing(createInvoiceValidator)

    const data = {
      feeId: body.feeId,
      invoiceNumber: body.invoiceNumber,
      totalAmount: Number(body.totalAmount),
      issueDate: DateTime.fromISO(`${body.issueDate}T00:00:00`),
      paymentDate: body.paymentDate ? DateTime.fromISO(`${body.paymentDate}T00:00:00`) : undefined,
      paymentMethod: body.paymentMethod,
    }

    console.log('📦 Datos a insertar Invoice:', data)

    const invoice = await Invoice.create(data)
    return response.created(invoice)
  }

  // UPDATE
  public async update({ params, request, response }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    const updates = await request.validateUsing(updateInvoiceValidator)
    invoice.merge(updates as any)
    await invoice.save()
    return response.ok(invoice)
  }

  // DELETE
  public async destroy({ params, response }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    await invoice.delete()
    return response.ok({ message: 'Invoice deleted successfully' })
  }
}