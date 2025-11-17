import type { HttpContext } from '@adonisjs/core/http'
import PlanActivitiesService from '#services/tourism/plan_activities_service'

export default class PlanActivitiesController {
  private planActivitiesService: PlanActivitiesService

  constructor() {
    this.planActivitiesService = new PlanActivitiesService()
  }

  /**
   * Get all plan activities
   * GET /plan-activities
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const planActivities = await this.planActivitiesService.findAll(page, perPage)
      return response.status(200).json(planActivities)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a plan activity by ID
   * GET /plan-activities/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const planActivity = await this.planActivitiesService.findById(params.id)
      return response.status(200).json(planActivity)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new plan activity
   * POST /plan-activities
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const planActivity = await this.planActivitiesService.create(data)
      return response.status(201).json(planActivity)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a plan activity
   * PUT /plan-activities/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const planActivity = await this.planActivitiesService.update(params.id, data)
      return response.status(200).json(planActivity)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a plan activity
   * DELETE /plan-activities/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const planActivity = await this.planActivitiesService.delete(params.id)
      return response.status(200).json(planActivity)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
