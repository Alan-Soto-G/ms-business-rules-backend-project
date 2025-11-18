import type { HttpContext } from '@adonisjs/core/http'
import TransportItinerariesService from '#services/transportation/transport_itineraries_service'
import {
  createTransportItineraryValidator,
  updateTransportItineraryValidator,
  assignTransportItineraryValidator,
} from '#validators/transportation/transport_itinerary'

export default class TransportItinerariesController {
  private transportItinerariesService: TransportItinerariesService

  constructor() {
    this.transportItinerariesService = new TransportItinerariesService()
  }

  /**
   * GET /transport-itineraries
   * Get all transport itineraries with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const itineraries = await this.transportItinerariesService.getAllTransportItineraries(
        page,
        limit
      )

      return response.ok({
        message: 'Transport itineraries retrieved successfully',
        data: itineraries,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving transport itineraries',
        error: error.message,
      })
    }
  }

  /**
   * GET /transport-itineraries/:id
   * Get transport itinerary by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const itinerary = await this.transportItinerariesService.getTransportItineraryById(params.id)

      if (!itinerary) {
        return response.notFound({
          message: 'Transport itinerary not found',
        })
      }

      return response.ok({
        message: 'Transport itinerary retrieved successfully',
        data: itinerary,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving transport itinerary',
        error: error.message,
      })
    }
  }

  /**
   * GET /transport-itineraries/journey/:journeyId
   * Get all transport itineraries by journey
   */
  async getByJourney({ params, response }: HttpContext) {
    try {
      const itineraries = await this.transportItinerariesService.getTransportItinerariesByJourney(
        params.journeyId
      )

      return response.ok({
        message: 'Transport itineraries by journey retrieved successfully',
        data: itineraries,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving transport itineraries by journey',
        error: error.message,
      })
    }
  }

  /**
   * GET /transport-itineraries/trip/:tripId
   * Get all transport itineraries by trip
   */
  async getByTrip({ params, response }: HttpContext) {
    try {
      const itineraries = await this.transportItinerariesService.getTransportItinerariesByTrip(
        params.tripId
      )

      return response.ok({
        message: 'Transport itineraries by trip retrieved successfully',
        data: itineraries,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving transport itineraries by trip',
        error: error.message,
      })
    }
  }

  /**
   * POST /transport-itineraries
   * Create new transport itinerary
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createTransportItineraryValidator)

      const itinerary = await this.transportItinerariesService.createTransportItinerary(data)

      return response.created({
        message: 'Transport itinerary created successfully',
        data: itinerary,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.message.includes('does not exist')) {
        return response.badRequest({
          message: error.message,
        })
      }

      if (error.message.includes('already exists')) {
        return response.conflict({
          message: error.message,
        })
      }

      if (error.code === '23503') {
        return response.badRequest({
          message: 'Invalid journey ID, trip ID, or transportation service ID',
        })
      }

      return response.internalServerError({
        message: 'Error creating transport itinerary',
        error: error.message,
      })
    }
  }

  /**
   * POST /transport-itineraries/assign
   * Assign transport itinerary between journey and trip
   */
  async assign({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(assignTransportItineraryValidator)

      const itinerary = await this.transportItinerariesService.assignTransportItinerary(data)

      return response.created({
        message: 'Transport itinerary assigned successfully',
        data: itinerary,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.message.includes('does not exist')) {
        return response.badRequest({
          message: error.message,
        })
      }

      if (error.message.includes('already exists')) {
        return response.conflict({
          message: error.message,
        })
      }

      return response.internalServerError({
        message: 'Error assigning transport itinerary',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /transport-itineraries/unassign/:journeyId/:tripId
   * Unassign transport itinerary between journey and trip
   */
  async unassign({ params, response }: HttpContext) {
    try {
      const deleted = await this.transportItinerariesService.unassignTransportItinerary(
        params.journeyId,
        params.tripId
      )

      if (!deleted) {
        return response.notFound({
          message: 'Transport itinerary not found',
        })
      }

      return response.ok({
        message: 'Transport itinerary unassigned successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error unassigning transport itinerary',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /transport-itineraries/:id
   * Update transport itinerary
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateTransportItineraryValidator)

      const itinerary = await this.transportItinerariesService.updateTransportItinerary(
        params.id,
        data
      )

      if (!itinerary) {
        return response.notFound({
          message: 'Transport itinerary not found',
        })
      }

      return response.ok({
        message: 'Transport itinerary updated successfully',
        data: itinerary,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.message.includes('does not exist')) {
        return response.badRequest({
          message: error.message,
        })
      }

      if (error.message.includes('already exists')) {
        return response.conflict({
          message: error.message,
        })
      }

      return response.internalServerError({
        message: 'Error updating transport itinerary',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /transport-itineraries/:id
   * Delete transport itinerary
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.transportItinerariesService.deleteTransportItinerary(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Transport itinerary not found',
        })
      }

      return response.ok({
        message: 'Transport itinerary deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting transport itinerary',
        error: error.message,
      })
    }
  }
}
