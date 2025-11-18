import type { HttpContext } from '@adonisjs/core/http'
import AircraftsService from '#services/transportation/aircrafts_service'
import {
  createAircraftValidator,
  updateAircraftValidator,
} from '#validators/transportation/aircraft'

export default class AircraftsController {
  private aircraftsService: AircraftsService

  constructor() {
    this.aircraftsService = new AircraftsService()
  }

  /**
   * GET /aircrafts
   * Get all aircrafts with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const aircrafts = await this.aircraftsService.getAllAircrafts(page, limit)

      return response.ok({
        message: 'Aircrafts retrieved successfully',
        data: aircrafts,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving aircrafts',
        error: error.message,
      })
    }
  }

  /**
   * GET /aircrafts/:id
   * Get aircraft by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const aircraft = await this.aircraftsService.getAircraftById(params.id)

      if (!aircraft) {
        return response.notFound({
          message: 'Aircraft not found',
        })
      }

      return response.ok({
        message: 'Aircraft retrieved successfully',
        data: aircraft,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving aircraft',
        error: error.message,
      })
    }
  }

  /**
   * POST /aircrafts
   * Create new aircraft
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createAircraftValidator)

      const aircraft = await this.aircraftsService.createAircraft(data)

      return response.created({
        message: 'Aircraft created successfully',
        data: aircraft,
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

      if (error.code === '23503') {
        return response.badRequest({
          message: 'Invalid airline ID or vehicle ID',
        })
      }

      return response.internalServerError({
        message: 'Error creating aircraft',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /aircrafts/:id
   * Update aircraft
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateAircraftValidator)

      const aircraft = await this.aircraftsService.updateAircraft(params.id, data)

      if (!aircraft) {
        return response.notFound({
          message: 'Aircraft not found',
        })
      }

      return response.ok({
        message: 'Aircraft updated successfully',
        data: aircraft,
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

      if (error.code === '23503') {
        return response.badRequest({
          message: 'Invalid airline ID',
        })
      }

      return response.internalServerError({
        message: 'Error updating aircraft',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /aircrafts/:id
   * Delete aircraft
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.aircraftsService.deleteAircraft(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Aircraft not found',
        })
      }

      return response.ok({
        message: 'Aircraft deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting aircraft',
        error: error.message,
      })
    }
  }
}
