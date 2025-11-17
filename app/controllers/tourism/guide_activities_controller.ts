import type { HttpContext } from '@adonisjs/core/http'
import GuideActivitiesService from '#services/tourism/guide_activities_service'

export default class GuideActivitiesController {
  private guideActivitiesService: GuideActivitiesService

  constructor() {
    this.guideActivitiesService = new GuideActivitiesService()
  }

  /**
   * Get all guide activities
   * GET /guide-activities
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const guideActivities = await this.guideActivitiesService.findAll(page, perPage)
      return response.status(200).json(guideActivities)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a guide activity by ID
   * GET /guide-activities/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const guideActivity = await this.guideActivitiesService.findById(params.id)
      return response.status(200).json(guideActivity)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new guide activity
   * POST /guide-activities
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const guideActivity = await this.guideActivitiesService.create(data)
      return response.status(201).json(guideActivity)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a guide activity
   * PUT /guide-activities/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const guideActivity = await this.guideActivitiesService.update(params.id, data)
      return response.status(200).json(guideActivity)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a guide activity
   * DELETE /guide-activities/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const guideActivity = await this.guideActivitiesService.delete(params.id)
      return response.status(200).json(guideActivity)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
