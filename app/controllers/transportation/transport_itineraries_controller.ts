import type { HttpContext } from '@adonisjs/core/http'
import TransportItinerariesService from '#services/transportation/transport_itineraries_service'

export default class TransportItinerariesController {
  private transportItinerariesService: TransportItinerariesService

  constructor() {
    this.transportItinerariesService = new TransportItinerariesService()
  }

  /**
   * Get all transport itineraries
   * GET /transport-itineraries
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const itineraries = await this.transportItinerariesService.findAll(page, perPage)
      return response.status(200).json(itineraries)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a transport itinerary by ID
   * GET /transport-itineraries/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const itinerary = await this.transportItinerariesService.findById(params.id)
      return response.status(200).json(itinerary)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new transport itinerary
   * POST /transport-itineraries
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const itinerary = await this.transportItinerariesService.create(data)
      return response.status(201).json(itinerary)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a transport itinerary
   * PUT /transport-itineraries/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const itinerary = await this.transportItinerariesService.update(params.id, data)
      return response.status(200).json(itinerary)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a transport itinerary
   * DELETE /transport-itineraries/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const itinerary = await this.transportItinerariesService.delete(params.id)
      return response.status(200).json(itinerary)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
