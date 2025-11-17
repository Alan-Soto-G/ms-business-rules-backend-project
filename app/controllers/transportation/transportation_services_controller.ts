import type { HttpContext } from '@adonisjs/core/http'
import TransportationServicesService from '#services/transportation/transportation_services_service'

export default class TransportationServicesController {
  private transportationServicesService: TransportationServicesService

  constructor() {
    this.transportationServicesService = new TransportationServicesService()
  }

  /**
   * Get all transportation services
   * GET /transportation-services
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const services = await this.transportationServicesService.findAll(page, perPage)
      return response.status(200).json(services)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a transportation service by ID
   * GET /transportation-services/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const service = await this.transportationServicesService.findById(params.id)
      return response.status(200).json(service)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new transportation service
   * POST /transportation-services
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const service = await this.transportationServicesService.create(data)
      return response.status(201).json(service)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a transportation service
   * PUT /transportation-services/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const service = await this.transportationServicesService.update(params.id, data)
      return response.status(200).json(service)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a transportation service
   * DELETE /transportation-services/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const service = await this.transportationServicesService.delete(params.id)
      return response.status(200).json(service)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
