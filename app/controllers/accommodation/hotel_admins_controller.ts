import type { HttpContext } from '@adonisjs/core/http'
import HotelAdminsService from '#services/accommodation/hotel_admins_service'
import {
  createHotelAdminValidator,
  updateHotelAdminValidator,
} from '#validators/accommodation/hotel_admin'

export default class HotelAdminsController {
  private hotelAdminsService: HotelAdminsService

  constructor() {
    this.hotelAdminsService = new HotelAdminsService()
  }

  /**
   * GET /hotel-admins
   * Get all hotel admins with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const hotelAdmins = await this.hotelAdminsService.getAllHotelAdmins(page, limit)

      return response.ok({
        message: 'Hotel admins retrieved successfully',
        data: hotelAdmins,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving hotel admins',
        error: error.message,
      })
    }
  }

  /**
   * GET /hotel-admins/:id
   * Get hotel admin by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const hotelAdmin = await this.hotelAdminsService.getHotelAdminById(params.id)

      if (!hotelAdmin) {
        return response.notFound({
          message: 'Hotel admin not found',
        })
      }

      return response.ok({
        message: 'Hotel admin retrieved successfully',
        data: hotelAdmin,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving hotel admin',
        error: error.message,
      })
    }
  }

  /**
   * POST /hotel-admins
   * Create new hotel admin
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createHotelAdminValidator)

      const hotelAdmin = await this.hotelAdminsService.createHotelAdmin(data)

      return response.created({
        message: 'Hotel admin created successfully',
        data: hotelAdmin,
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
        message: 'Error creating hotel admin',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /hotel-admins/:id
   * Update hotel admin
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateHotelAdminValidator)

      const hotelAdmin = await this.hotelAdminsService.updateHotelAdmin(params.id, data)

      if (!hotelAdmin) {
        return response.notFound({
          message: 'Hotel admin not found',
        })
      }

      return response.ok({
        message: 'Hotel admin updated successfully',
        data: hotelAdmin,
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
        message: 'Error updating hotel admin',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /hotel-admins/:id
   * Delete hotel admin
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.hotelAdminsService.deleteHotelAdmin(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Hotel admin not found',
        })
      }

      return response.ok({
        message: 'Hotel admin deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting hotel admin',
        error: error.message,
      })
    }
  }
}
