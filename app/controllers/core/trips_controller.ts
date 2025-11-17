import type { HttpContext } from '@adonisjs/core/http'
import TripsService from '#services/core/trips_service'

export default class TripsController {
  private tripsService: TripsService

  constructor() {
    this.tripsService = new TripsService()
  }

  /**
   * Get all trips
   * GET /trips
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const trips = await this.tripsService.findAll(page, perPage)
      return response.status(200).json(trips)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a trip by ID
   * GET /trips/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const trip = await this.tripsService.findById(params.id)
      return response.status(200).json(trip)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new trip
   * POST /trips
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const trip = await this.tripsService.create(data)
      return response.status(201).json(trip)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a trip
   * PUT /trips/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const trip = await this.tripsService.update(params.id, data)
      return response.status(200).json(trip)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a trip
   * DELETE /trips/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const trip = await this.tripsService.delete(params.id)
      return response.status(200).json(trip)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
