import type { HttpContext } from '@adonisjs/core/http'
import TripsService from '#services/core/trips_service'
import { createTripValidator, updateTripValidator } from '#validators/core/trip'

export default class TripsController {
  private tripsService: TripsService

  constructor() {
    this.tripsService = new TripsService()
  }

  /**
   * GET /trips
   * Get all trips with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const trips = await this.tripsService.getAllTrips(page, limit)

      return response.ok({
        message: 'Trips retrieved successfully',
        data: trips,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving trips',
        error: error.message,
      })
    }
  }

  /**
   * GET /trips/:id
   * Get trip by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const trip = await this.tripsService.getTripById(params.id)

      if (!trip) {
        return response.notFound({
          message: 'Trip not found',
        })
      }

      return response.ok({
        message: 'Trip retrieved successfully',
        data: trip,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving trip',
        error: error.message,
      })
    }
  }

  /**
   * POST /trips
   * Create new trip
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createTripValidator)

      const trip = await this.tripsService.createTrip(data)

      return response.created({
        message: 'Trip created successfully',
        data: trip,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Error creating trip',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /trips/:id
   * Update trip
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateTripValidator)

      const trip = await this.tripsService.updateTrip(params.id, data)

      if (!trip) {
        return response.notFound({
          message: 'Trip not found',
        })
      }

      return response.ok({
        message: 'Trip updated successfully',
        data: trip,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Error updating trip',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /trips/:id
   * Delete trip
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.tripsService.deleteTrip(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Trip not found',
        })
      }

      return response.ok({
        message: 'Trip deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting trip',
        error: error.message,
      })
    }
  }
}
