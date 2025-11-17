import type { HttpContext } from '@adonisjs/core/http'
import JourneysService from '#services/transportation/journeys_service'

export default class JourneysController {
  private journeysService: JourneysService

  constructor() {
    this.journeysService = new JourneysService()
  }

  /**
   * Get all journeys
   * GET /journeys
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const journeys = await this.journeysService.findAll(page, perPage)
      return response.status(200).json(journeys)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a journey by ID
   * GET /journeys/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const journey = await this.journeysService.findById(params.id)
      return response.status(200).json(journey)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new journey
   * POST /journeys
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const journey = await this.journeysService.create(data)
      return response.status(201).json(journey)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a journey
   * PUT /journeys/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const journey = await this.journeysService.update(params.id, data)
      return response.status(200).json(journey)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a journey
   * DELETE /journeys/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const journey = await this.journeysService.delete(params.id)
      return response.status(200).json(journey)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
