import type { HttpContext } from '@adonisjs/core/http'
import Invoice from '#models/invoice'
import { createInvoiceValidator, updateInvoiceValidator } from '#validators/invoice'

/**
 * Controlador de Invoices (Facturas)
 *
 * Contiene los métodos CRUD básicos expuestos por la API:
 * - index: obtener facturas (con paginación opcional)
 * - show: obtener una factura por ID
 * - store: crear una nueva factura
 * - update: actualizar factura existente
 * - destroy: eliminar factura
 * - findByFee: obtener facturas de una cuota específica
 */
export default class InvoicesController {
  /**
   * Obtener lista de facturas (paginada opcionalmente).
   */
  public async index({ request, response }: HttpContext) {
    const data = request.all()

    if ('page' in data && 'per_page' in data) {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const invoices = await Invoice.query().preload('fee').paginate(page, perPage)
      return response.status(200).json(invoices)
    }

    const allInvoices = await Invoice.query().preload('fee')
    return response.status(200).json(allInvoices)
  }

  /**
   * Obtener una factura individual por ID.
   */
  public async show({ params, response }: HttpContext) {
    const theInvoice: Invoice = await Invoice.findOrFail(params.id)
    await theInvoice.load('fee')
    return response.status(200).json(theInvoice)
  }

  /**
   * Crear una nueva factura.
   */
  public async store({ request, response }: HttpContext) {
    const body = await request.validateUsing(createInvoiceValidator)
    const theInvoice: Invoice = await Invoice.create(body)

    if (!theInvoice) {
      return response.status(500).json({ message: 'Error creating invoice' })
    }

    return response.status(201).json(theInvoice)
  }

  /**
   * Actualizar una factura existente.
   */
  public async update({ params, request, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const theInvoice: Invoice = await Invoice.findOrFail(params.id)
    const updates = await request.validateUsing(updateInvoiceValidator)

    theInvoice.merge(updates)
    await theInvoice.save()

    return response.status(200).json(theInvoice)
  }

  /**
   * Eliminar una factura por id.
   */
  public async destroy({ params, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const theInvoice: Invoice = await Invoice.findOrFail(params.id)
    await theInvoice.delete()

    return response.status(200).json({ message: 'Invoice deleted successfully' })
  }

  /**
   * Obtener facturas de una cuota específica.
   * ⚠️ Ruta manual, no parte de .resource()
   */
  public async findByFee({ params, response }: HttpContext) {
    if (!params.feeId) {
      return response.status(400).json({ message: 'Missing feeId parameter' })
    }

    const invoices = await Invoice.query().where('fee_id', params.feeId)
    return response.status(200).json(invoices)
  }
}
