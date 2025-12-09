import type { HttpContext } from '@adonisjs/core/http'
import ClientsService from '#services/core/clients_service'
import { createClientValidator, updateClientValidator } from '#validators/core/client'
import Client from '#models/core/client'

export default class ClientsController {
  private clientsService: ClientsService

  constructor() {
    this.clientsService = new ClientsService()
  }

  /**
   * GET /clients
   * Get all clients with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const clients = await this.clientsService.getAllClients(page, limit)

      return response.ok({
        message: 'Clients retrieved successfully',
        data: clients,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving clients',
        error: error.message,
      })
    }
  }

  /**
   * GET /clients/by-user
   * Get client by user_id from JWT token
   */
async getByUserId({ request, response }: HttpContext) {
  try {
    const authHeader = request.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.unauthorized({
        message: 'No token provided',
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

    const client = await Client.query().where('userId', userId).first()

    if (!client) {
      return response.notFound({
        message: 'User is not a client',
      })
    }

    return response.ok({
      message: 'Client found',
      data: {
        clientId: client.id,
        client: client,
      },
    })
  } catch (error) {
    return response.internalServerError({
      message: 'Error retrieving client',
      error: error.message,
    })
  }
}
  /**
   * GET /clients/:id
   * Get client by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const client = await this.clientsService.getClientById(params.id)

      if (!client) {
        return response.notFound({
          message: 'Client not found',
        })
      }

      return response.ok({
        message: 'Client retrieved successfully',
        data: client,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving client',
        error: error.message,
      })
    }
  }

  /**
   * POST /clients
   * Create new client
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createClientValidator)

      const client = await this.clientsService.createClient(data)

      return response.created({
        message: 'Client created successfully',
        data: client,
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
          message: 'User ID already exists',
        })
      }

      return response.internalServerError({
        message: 'Error creating client',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /clients/:id
   * Update client
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateClientValidator)

      const client = await this.clientsService.updateClient(params.id, data)

      if (!client) {
        return response.notFound({
          message: 'Client not found',
        })
      }

      return response.ok({
        message: 'Client updated successfully',
        data: client,
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
          message: 'User ID already exists',
        })
      }

      return response.internalServerError({
        message: 'Error updating client',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /clients/:id
   * Delete client
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.clientsService.deleteClient(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Client not found',
        })
      }

      return response.ok({
        message: 'Client deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting client',
        error: error.message,
      })
    }
  }
}