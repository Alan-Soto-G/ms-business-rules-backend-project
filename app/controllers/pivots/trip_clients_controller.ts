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
   * GET /trip-clients/my-orders
   * Get orders for authenticated user
   */
  async getMyOrders({ request, response }: HttpContext) {
  try {
    const authHeader = request.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.ok({
        message: 'No authenticated user',
        data: []
      })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // ✅ SOLO DECODIFICAR, NO VERIFICAR
    let decoded: any
    try {
      const payload = token.split('.')[1]
      const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8')
      decoded = JSON.parse(decodedPayload)
    } catch (error) {
      return response.unauthorized({
        message: 'Invalid token format'
      })
    }

    const userId = decoded._id
    const Client = (await import('#models/core/client')).default
    const client = await Client.query().where('userId', userId).first()

    if (!client) {
      return response.ok({
        message: 'User is not a client',
        data: []
      })
    }

    const orders = await this.tripClientsService.getOrdersByClient(client.id)

    return response.ok({
      message: 'Orders retrieved successfully',
      data: orders
    })
  } catch (error) {
    return response.internalServerError({
      message: 'Error retrieving orders',
      error: error.message
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
    async show({ params, response }: HttpContext) {
    try {
      const tripClient = await this.tripClientsService.getTripClientById(params.id)

      if (!tripClient) {
        return response.notFound({
          message: 'Trip plan not found',
        })
      }

      return response.ok({
        message: 'Trip plan retrieved successfully',
        data: tripClient,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving trip plan',
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
    const result = await this.tripClientsService.deleteTripClient(params.id)

    // ¿No se encontró?
    if (result.error === 'not_found') {
      return response.notFound({
        message: 'Orden no encontrada',
      })
    }
    
    // ¿Tiene pagos?
    if (result.error === 'payment_exists') {
      return response.badRequest({
        message: result.message,
        error: 'PAYMENT_EXISTS'
      })
    }

    // Todo bien, eliminado
    return response.ok({
      message: 'Orden eliminada exitosamente',
    })
  } catch (error) {
    return response.internalServerError({
      message: 'Error al eliminar',
      error: error.message,
    })
  }
}
}