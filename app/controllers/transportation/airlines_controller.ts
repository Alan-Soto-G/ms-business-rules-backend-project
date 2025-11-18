import type { HttpContext } from '@adonisjs/core/http'
import AirlinesService from '#services/transportation/airlines_service'
import { createAirlineValidator, updateAirlineValidator } from '#validators/transportation/airline'

export default class AirlinesController {
  private airlinesService: AirlinesService

  constructor() {
    this.airlinesService = new AirlinesService()
  }

  /**
   * GET /airlines
   * Get all airlines with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const airlines = await this.airlinesService.getAllAirlines(page, limit)

      return response.ok({
        message: 'Airlines retrieved successfully',
        data: airlines,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving airlines',
        error: error.message,
      })
    }
  }

  /**
   * GET /airlines/:id
   * Get airline by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const airline = await this.airlinesService.getAirlineById(params.id)

      if (!airline) {
        return response.notFound({
          message: 'Airline not found',
        })
      }

      return response.ok({
        message: 'Airline retrieved successfully',
        data: airline,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving airline',
        error: error.message,
      })
    }
  }

  /**
   * POST /airlines
   * Create new airline
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createAirlineValidator)

      const airline = await this.airlinesService.createAirline(data)

      return response.created({
        message: 'Airline created successfully',
        data: airline,
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
          message: 'IATA or ICAO code already exists',
        })
      }

      return response.internalServerError({
        message: 'Error creating airline',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /airlines/:id
   * Update airline
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateAirlineValidator)

      const airline = await this.airlinesService.updateAirline(params.id, data)

      if (!airline) {
        return response.notFound({
          message: 'Airline not found',
        })
      }

      return response.ok({
        message: 'Airline updated successfully',
        data: airline,
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
          message: 'IATA or ICAO code already exists',
        })
      }

      return response.internalServerError({
        message: 'Error updating airline',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /airlines/:id
   * Delete airline
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.airlinesService.deleteAirline(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Airline not found',
        })
      }

      return response.ok({
        message: 'Airline deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting airline',
        error: error.message,
      })
    }
  }
}
