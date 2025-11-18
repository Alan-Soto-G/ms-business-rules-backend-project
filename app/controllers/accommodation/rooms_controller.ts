import type { HttpContext } from '@adonisjs/core/http'
import RoomsService from '#services/accommodation/rooms_service'
import { createRoomValidator, updateRoomValidator } from '#validators/accommodation/room'

export default class RoomsController {
  private roomsService: RoomsService

  constructor() {
    this.roomsService = new RoomsService()
  }

  /**
   * GET /rooms
   * Get all rooms with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const rooms = await this.roomsService.getAllRooms(page, limit)

      return response.ok({
        message: 'Rooms retrieved successfully',
        data: rooms,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving rooms',
        error: error.message,
      })
    }
  }

  /**
   * GET /rooms/:id
   * Get room by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const room = await this.roomsService.getRoomById(params.id)

      if (!room) {
        return response.notFound({
          message: 'Room not found',
        })
      }

      return response.ok({
        message: 'Room retrieved successfully',
        data: room,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving room',
        error: error.message,
      })
    }
  }

  /**
   * POST /rooms
   * Create new room
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createRoomValidator)

      const room = await this.roomsService.createRoom(data)

      return response.created({
        message: 'Room created successfully',
        data: room,
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
          message: 'Room number already exists for this hotel',
        })
      }

      if (error.code === '23503') {
        return response.notFound({
          message: 'Hotel not found',
        })
      }

      return response.internalServerError({
        message: 'Error creating room',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /rooms/:id
   * Update room
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateRoomValidator)

      const room = await this.roomsService.updateRoom(params.id, data)

      if (!room) {
        return response.notFound({
          message: 'Room not found',
        })
      }

      return response.ok({
        message: 'Room updated successfully',
        data: room,
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
          message: 'Room number already exists for this hotel',
        })
      }

      if (error.code === '23503') {
        return response.notFound({
          message: 'Hotel not found',
        })
      }

      return response.internalServerError({
        message: 'Error updating room',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /rooms/:id
   * Delete room
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.roomsService.deleteRoom(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Room not found',
        })
      }

      return response.ok({
        message: 'Room deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting room',
        error: error.message,
      })
    }
  }
}
