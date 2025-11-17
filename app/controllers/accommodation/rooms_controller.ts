import type { HttpContext } from '@adonisjs/core/http'
import RoomsService from '#services/accommodation/rooms_service'

export default class RoomsController {
  private roomsService: RoomsService

  constructor() {
    this.roomsService = new RoomsService()
  }

  /**
   * Get all rooms
   * GET /rooms
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const rooms = await this.roomsService.findAll(page, perPage)
      return response.status(200).json(rooms)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a room by ID
   * GET /rooms/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const room = await this.roomsService.findById(params.id)
      return response.status(200).json(room)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new room
   * POST /rooms
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const room = await this.roomsService.create(data)
      return response.status(201).json(room)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a room
   * PUT /rooms/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const room = await this.roomsService.update(params.id, data)
      return response.status(200).json(room)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a room
   * DELETE /rooms/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const room = await this.roomsService.delete(params.id)
      return response.status(200).json(room)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
