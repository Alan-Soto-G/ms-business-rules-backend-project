import type { HttpContext } from '@adonisjs/core/http'
import TripClientsService from '#services/pivots/trip_clients_service'
import {
  createTripClientValidator,
  updateTripClientValidator,
  assignTripClientValidator,
} from '#validators/pivots/trip_client'

export default class TripClientsController {
  private tripClientsService: TripClientsService

  constructor() {
    this.tripClientsService = new TripClientsService()
  }

  /**
   * GET /trip-clients
   * Get all trip clients with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const tripClients = await this.tripClientsService.getAllTripClients(page, limit)

      return response.ok({
        message: 'Trip clients retrieved successfully',
        data: tripClients,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving trip clients',
        error: error.message,
      })
    }
  }

  /**
   * GET /trip-clients/:id
   * Get trip client by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const tripClient = await this.tripClientsService.getTripClientById(params.id)

      if (!tripClient) {
        return response.notFound({
          message: 'Trip client not found',
        })
      }

      return response.ok({
        message: 'Trip client retrieved successfully',
        data: tripClient,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving trip client',
        error: error.message,
      })
    }
  }

  /**
   * GET /trip-clients/trip/:tripId
   * Get all clients by trip
   */
  async getByTrip({ params, response }: HttpContext) {
    try {
      const clients = await this.tripClientsService.getClientsByTrip(params.tripId)

      return response.ok({
        message: 'Clients by trip retrieved successfully',
        data: clients,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving clients by trip',
        error: error.message,
      })
    }
  }

  /**
   * GET /trip-clients/client/:clientId
   * Get all trips by client
   */
  async getByClient({ params, response }: HttpContext) {
    try {
      const trips = await this.tripClientsService.getTripsByClient(params.clientId)

      return response.ok({
        message: 'Trips by client retrieved successfully',
        data: trips,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving trips by client',
        error: error.message,
      })
    }
  }

  /**
   * POST /trip-clients
   * Create new trip client
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createTripClientValidator)

      const tripClient = await this.tripClientsService.createTripClient(data)

      return response.created({
        message: 'Trip client created successfully',
        data: tripClient,
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

      if (error.message.includes('already assigned')) {
        return response.conflict({
          message: error.message,
        })
      }

      return response.internalServerError({
        message: 'Error creating trip client',
        error: error.message,
      })
    }
  }

  /**
   * POST /trip-clients/assign
   * Assign client to trip
   */
  async assign({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(assignTripClientValidator)

      const tripClient = await this.tripClientsService.assignTripClient(data)

      return response.created({
        message: 'Client assigned to trip successfully',
        data: tripClient,
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

      if (error.message.includes('already assigned')) {
        return response.conflict({
          message: error.message,
        })
      }

      return response.internalServerError({
        message: 'Error assigning client to trip',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /trip-clients/unassign/:tripId/:clientId
   * Unassign client from trip
   */
  async unassign({ params, response }: HttpContext) {
    try {
      const deleted = await this.tripClientsService.unassignTripClient(
        params.tripId,
        params.clientId
      )

      if (!deleted) {
        return response.notFound({
          message: 'Trip client assignment not found',
        })
      }

      return response.ok({
        message: 'Client unassigned from trip successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error unassigning client from trip',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /trip-clients/:id
   * Update trip client
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateTripClientValidator)

      const tripClient = await this.tripClientsService.updateTripClient(params.id, data)

      if (!tripClient) {
        return response.notFound({
          message: 'Trip client not found',
        })
      }

      return response.ok({
        message: 'Trip client updated successfully',
        data: tripClient,
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

      if (error.message.includes('already assigned')) {
        return response.conflict({
          message: error.message,
        })
      }

      return response.internalServerError({
        message: 'Error updating trip client',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /trip-clients/:id
   * Delete trip client
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.tripClientsService.deleteTripClient(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Trip client not found',
        })
      }

      return response.ok({
        message: 'Trip client deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting trip client',
        error: error.message,
      })
    }
  }
}
