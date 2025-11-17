import type { HttpContext } from '@adonisjs/core/http'
import ClientsService from '#services/core/clients_service'

export default class ClientsController {
  private clientsService: ClientsService

  constructor() {
    this.clientsService = new ClientsService()
  }

  /**
   * Get all clients
   * GET /clients
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const clients = await this.clientsService.findAll(page, perPage)
      return response.status(200).json(clients)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a client by ID
   * GET /clients/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const client = await this.clientsService.findById(params.id)
      return response.status(200).json(client)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new client
   * POST /clients
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const client = await this.clientsService.create(data)
      return response.status(201).json(client)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a client
   * PUT /clients/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const client = await this.clientsService.update(params.id, data)
      return response.status(200).json(client)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a client
   * DELETE /clients/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const client = await this.clientsService.delete(params.id)
      return response.status(200).json(client)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
