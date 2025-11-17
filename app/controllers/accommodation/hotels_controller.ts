import type { HttpContext } from '@adonisjs/core/http'
import HotelsService from '#services/accommodation/hotels_service'

export default class HotelsController {
  private hotelsService: HotelsService

  constructor() {
    this.hotelsService = new HotelsService()
  }

  /**
   * Get all hotels
   * GET /hotels
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const hotels = await this.hotelsService.findAll(page, perPage)
      return response.status(200).json(hotels)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a hotel by ID
   * GET /hotels/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const hotel = await this.hotelsService.findById(params.id)
      return response.status(200).json(hotel)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new hotel
   * POST /hotels
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const hotel = await this.hotelsService.create(data)
      return response.status(201).json(hotel)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a hotel
   * PUT /hotels/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const hotel = await this.hotelsService.update(params.id, data)
      return response.status(200).json(hotel)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a hotel
   * DELETE /hotels/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const hotel = await this.hotelsService.delete(params.id)
      return response.status(200).json(hotel)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
