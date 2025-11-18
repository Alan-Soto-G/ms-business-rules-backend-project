import type { HttpContext } from '@adonisjs/core/http'
import VehiclesService from '#services/transportation/vehicles_service'
import { createVehicleValidator, updateVehicleValidator } from '#validators/transportation/vehicle'

export default class VehiclesController {
  private vehiclesService: VehiclesService

  constructor() {
    this.vehiclesService = new VehiclesService()
  }

  /**
   * GET /vehicles
   * Get all vehicles with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const vehicles = await this.vehiclesService.getAllVehicles(page, limit)

      return response.ok({
        message: 'Vehicles retrieved successfully',
        data: vehicles,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving vehicles',
        error: error.message,
      })
    }
  }

  /**
   * GET /vehicles/:id
   * Get vehicle by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const vehicle = await this.vehiclesService.getVehicleById(params.id)

      if (!vehicle) {
        return response.notFound({
          message: 'Vehicle not found',
        })
      }

      return response.ok({
        message: 'Vehicle retrieved successfully',
        data: vehicle,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving vehicle',
        error: error.message,
      })
    }
  }

  /**
   * POST /vehicles
   * Create new vehicle
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createVehicleValidator)

      const vehicle = await this.vehiclesService.createVehicle(data)

      return response.created({
        message: 'Vehicle created successfully',
        data: vehicle,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.code === '23505') {
        return response.conflict({
          message: 'License plate already exists',
        })
      }

      return response.internalServerError({
        message: 'Error creating vehicle',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /vehicles/:id
   * Update vehicle
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateVehicleValidator)

      const vehicle = await this.vehiclesService.updateVehicle(params.id, data)

      if (!vehicle) {
        return response.notFound({
          message: 'Vehicle not found',
        })
      }

      return response.ok({
        message: 'Vehicle updated successfully',
        data: vehicle,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.code === '23505') {
        return response.conflict({
          message: 'License plate already exists',
        })
      }

      return response.internalServerError({
        message: 'Error updating vehicle',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /vehicles/:id
   * Delete vehicle
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.vehiclesService.deleteVehicle(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Vehicle not found',
        })
      }

      return response.ok({
        message: 'Vehicle deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting vehicle',
        error: error.message,
      })
    }
  }
}
