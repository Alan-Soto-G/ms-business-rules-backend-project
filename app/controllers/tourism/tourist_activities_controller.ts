import type { HttpContext } from '@adonisjs/core/http'
import TouristActivitiesService from '#services/tourism/tourist_activities_service'

export default class TouristActivitiesController {
  private touristActivitiesService: TouristActivitiesService

  constructor() {
    this.touristActivitiesService = new TouristActivitiesService()
  }

  /**
   * Get all tourist activities
   * GET /tourist-activities
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const activities = await this.touristActivitiesService.findAll(page, perPage)
      return response.status(200).json(activities)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a tourist activity by ID
   * GET /tourist-activities/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const activity = await this.touristActivitiesService.findById(params.id)
      return response.status(200).json(activity)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new tourist activity
   * POST /tourist-activities
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const activity = await this.touristActivitiesService.create(data)
      return response.status(201).json(activity)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a tourist activity
   * PUT /tourist-activities/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const activity = await this.touristActivitiesService.update(params.id, data)
      return response.status(200).json(activity)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a tourist activity
   * DELETE /tourist-activities/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const activity = await this.touristActivitiesService.delete(params.id)
      return response.status(200).json(activity)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
