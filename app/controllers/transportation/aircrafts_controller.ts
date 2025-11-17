import type { HttpContext } from '@adonisjs/core/http'
import AircraftsService from '#services/transportation/aircrafts_service'

export default class AircraftsController {
  private aircraftsService: AircraftsService

  constructor() {
    this.aircraftsService = new AircraftsService()
  }

  /**
   * Get all aircrafts
   * GET /aircrafts
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const aircrafts = await this.aircraftsService.findAll(page, perPage)
      return response.status(200).json(aircrafts)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get an aircraft by ID
   * GET /aircrafts/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const aircraft = await this.aircraftsService.findById(params.id)
      return response.status(200).json(aircraft)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new aircraft
   * POST /aircrafts
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const aircraft = await this.aircraftsService.create(data)
      return response.status(201).json(aircraft)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update an aircraft
   * PUT /aircrafts/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const aircraft = await this.aircraftsService.update(params.id, data)
      return response.status(200).json(aircraft)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete an aircraft
   * DELETE /aircrafts/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const aircraft = await this.aircraftsService.delete(params.id)
      return response.status(200).json(aircraft)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
