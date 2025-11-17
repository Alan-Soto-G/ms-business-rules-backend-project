import type { HttpContext } from '@adonisjs/core/http'
import FeesService from '#services/financial/fees_service'

export default class FeesController {
  private feesService: FeesService

  constructor() {
    this.feesService = new FeesService()
  }

  /**
   * Get all fees
   * GET /fees
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const fees = await this.feesService.findAll(page, perPage)
      return response.status(200).json(fees)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a fee by ID
   * GET /fees/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const fee = await this.feesService.findById(params.id)
      return response.status(200).json(fee)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new fee
   * POST /fees
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const fee = await this.feesService.create(data)
      return response.status(201).json(fee)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a fee
   * PUT /fees/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const fee = await this.feesService.update(params.id, data)
      return response.status(200).json(fee)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a fee
   * DELETE /fees/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const fee = await this.feesService.delete(params.id)
      return response.status(200).json(fee)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
