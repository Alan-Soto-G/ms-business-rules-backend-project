import type { HttpContext } from '@adonisjs/core/http'
import InvoicesService from '#services/financial/invoices_service'

export default class InvoicesController {
  private invoicesService: InvoicesService

  constructor() {
    this.invoicesService = new InvoicesService()
  }

  /**
   * Obtener lista de facturas (paginada opcionalmente).
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const invoices = await this.invoicesService.findAll(page, perPage)
      return response.status(200).json(invoices)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Obtener una factura individual por ID.
   */
  public async show({ params, response }: HttpContext) {
    try {
      const invoice = await this.invoicesService.findById(params.id)
      return response.status(200).json(invoice)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Crear una nueva factura.
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const invoice = await this.invoicesService.create(data)
      return response.status(201).json(invoice)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Actualizar una factura existente.
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const invoice = await this.invoicesService.update(params.id, data)
      return response.status(200).json(invoice)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Eliminar una factura por id.
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const invoice = await this.invoicesService.delete(params.id)
      return response.status(200).json(invoice)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
