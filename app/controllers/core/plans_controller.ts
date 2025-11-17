import type { HttpContext } from '@adonisjs/core/http'
import PlansService from '#services/core/plans_service'

export default class PlansController {
  private plansService: PlansService

  constructor() {
    this.plansService = new PlansService()
  }

  /**
   * Get all plans
   * GET /plans
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const plans = await this.plansService.findAll(page, perPage)
      return response.status(200).json(plans)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a plan by ID
   * GET /plans/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const plan = await this.plansService.findById(params.id)
      return response.status(200).json(plan)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new plan
   * POST /plans
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const plan = await this.plansService.create(data)
      return response.status(201).json(plan)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a plan
   * PUT /plans/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const plan = await this.plansService.update(params.id, data)
      return response.status(200).json(plan)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a plan
   * DELETE /plans/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const plan = await this.plansService.delete(params.id)
      return response.status(200).json(plan)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
