import type { HttpContext } from '@adonisjs/core/http'
import HotelsService from '#services/accommodation/hotels_service'
import { createHotelValidator, updateHotelValidator } from '#validators/accommodation/hotel'

export default class HotelsController {
  private hotelsService: HotelsService

  constructor() {
    this.hotelsService = new HotelsService()
  }

  /**
   * GET /hotels
   * Get all hotels with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const hotels = await this.hotelsService.getAllHotels(page, limit)

      return response.ok({
        message: 'Hotels retrieved successfully',
        data: hotels,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving hotels',
        error: error.message,
      })
    }
  }

  /**
   * GET /hotels/:id
   * Get hotel by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const hotel = await this.hotelsService.getHotelById(params.id)

      if (!hotel) {
        return response.notFound({
          message: 'Hotel not found',
        })
      }

      return response.ok({
        message: 'Hotel retrieved successfully',
        data: hotel,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving hotel',
        error: error.message,
      })
    }
  }

  /**
   * POST /hotels
   * Create new hotel
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createHotelValidator)

      const hotel = await this.hotelsService.createHotel(data)

      return response.created({
        message: 'Hotel created successfully',
        data: hotel,
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
          message: 'Email or phone already exists',
        })
      }

      return response.internalServerError({
        message: 'Error creating hotel',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /hotels/:id
   * Update hotel
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateHotelValidator)

      const hotel = await this.hotelsService.updateHotel(params.id, data)

      if (!hotel) {
        return response.notFound({
          message: 'Hotel not found',
        })
      }

      return response.ok({
        message: 'Hotel updated successfully',
        data: hotel,
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
          message: 'Email or phone already exists',
        })
      }

      return response.internalServerError({
        message: 'Error updating hotel',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /hotels/:id
   * Delete hotel
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.hotelsService.deleteHotel(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Hotel not found',
        })
      }

      return response.ok({
        message: 'Hotel deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting hotel',
        error: error.message,
      })
    }
  }
}

