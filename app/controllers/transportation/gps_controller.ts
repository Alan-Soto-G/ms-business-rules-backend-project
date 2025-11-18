import type { HttpContext } from '@adonisjs/core/http'
import GpsService from '#services/transportation/gps_service'
import { createGpsValidator, updateGpsValidator } from '#validators/transportation/gps'

export default class GpsController {
  private gpsService: GpsService

  constructor() {
    this.gpsService = new GpsService()
  }

  /**
   * GET /gps
   * Get all GPS devices with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const gpsDevices = await this.gpsService.getAllGps(page, limit)

      return response.ok({
        message: 'GPS devices retrieved successfully',
        data: gpsDevices,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving GPS devices',
        error: error.message,
      })
    }
  }

  /**
   * GET /gps/:id
   * Get GPS device by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const gps = await this.gpsService.getGpsById(params.id)

      if (!gps) {
        return response.notFound({
          message: 'GPS device not found',
        })
      }

      return response.ok({
        message: 'GPS device retrieved successfully',
        data: gps,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving GPS device',
        error: error.message,
      })
    }
  }

  /**
   * POST /gps
   * Create new GPS device
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createGpsValidator)

      const gps = await this.gpsService.createGps(data)

      return response.created({
        message: 'GPS device created successfully',
        data: gps,
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
          message: 'Serial number already exists or vehicle already has a GPS device',
        })
      }

      if (error.code === '23503') {
        return response.badRequest({
          message: 'Invalid vehicle ID',
        })
      }

      return response.internalServerError({
        message: 'Error creating GPS device',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /gps/:id
   * Update GPS device
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateGpsValidator)

      const gps = await this.gpsService.updateGps(params.id, data)

      if (!gps) {
        return response.notFound({
          message: 'GPS device not found',
        })
      }

      return response.ok({
        message: 'GPS device updated successfully',
        data: gps,
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
          message: 'Serial number already exists or vehicle already has a GPS device',
        })
      }

      if (error.code === '23503') {
        return response.badRequest({
          message: 'Invalid vehicle ID',
        })
      }

      return response.internalServerError({
        message: 'Error updating GPS device',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /gps/:id
   * Delete GPS device
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.gpsService.deleteGps(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'GPS device not found',
        })
      }

      return response.ok({
        message: 'GPS device deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting GPS device',
        error: error.message,
      })
    }
  }
}
