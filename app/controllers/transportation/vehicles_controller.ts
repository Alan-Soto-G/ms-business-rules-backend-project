import type { HttpContext } from '@adonisjs/core/http'
import { VehiclesService } from '#services/transportation/index'

export default class VehiclesController {
  private vehiclesService: VehiclesService

  constructor() {
    this.vehiclesService = new VehiclesService()
  }

  /**
   * Get all vehicles
   * GET /vehicles
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const vehicles = await this.vehiclesService.findAll(page, perPage)
      return response.status(200).json(vehicles)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a vehicle by ID
   * GET /vehicles/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const vehicle = await this.vehiclesService.findById(params.id)
      return response.status(200).json(vehicle)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new vehicle
   * POST /vehicles
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const vehicle = await this.vehiclesService.create(data)
      return response.status(201).json(vehicle)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a vehicle
   * PUT /vehicles/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const vehicle = await this.vehiclesService.update(params.id, data)
      return response.status(200).json(vehicle)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a vehicle
   * DELETE /vehicles/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const vehicle = await this.vehiclesService.delete(params.id)
      return response.status(200).json(vehicle)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
