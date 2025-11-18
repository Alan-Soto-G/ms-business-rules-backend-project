import type { HttpContext } from '@adonisjs/core/http'
import TouristActivitiesService from '#services/tourism/tourist_activities_service'
import {
  createTouristActivityValidator,
  updateTouristActivityValidator,
} from '#validators/tourism/tourist_activity'

export default class TouristActivitiesController {
  private touristActivitiesService: TouristActivitiesService

  constructor() {
    this.touristActivitiesService = new TouristActivitiesService()
  }

  /**
   * GET /tourist-activities
   * Get all tourist activities with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const touristActivities = await this.touristActivitiesService.getAllTouristActivities(
        page,
        limit
      )

      return response.ok({
        message: 'Tourist activities retrieved successfully',
        data: touristActivities,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving tourist activities',
        error: error.message,
      })
    }
  }

  /**
   * GET /tourist-activities/:id
   * Get tourist activity by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const touristActivity = await this.touristActivitiesService.getTouristActivityById(
        params.id
      )

      if (!touristActivity) {
        return response.notFound({
          message: 'Tourist activity not found',
        })
      }

      return response.ok({
        message: 'Tourist activity retrieved successfully',
        data: touristActivity,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving tourist activity',
        error: error.message,
      })
    }
  }

  /**
   * POST /tourist-activities
   * Create new tourist activity
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createTouristActivityValidator)

      const touristActivity = await this.touristActivitiesService.createTouristActivity(data)

      return response.created({
        message: 'Tourist activity created successfully',
        data: touristActivity,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.code === '23503') {
        return response.notFound({
          message: 'Municipality not found',
        })
      }

      return response.internalServerError({
        message: 'Error creating tourist activity',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /tourist-activities/:id
   * Update tourist activity
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateTouristActivityValidator)

      const touristActivity = await this.touristActivitiesService.updateTouristActivity(
        params.id,
        data
      )

      if (!touristActivity) {
        return response.notFound({
          message: 'Tourist activity not found',
        })
      }

      return response.ok({
        message: 'Tourist activity updated successfully',
        data: touristActivity,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.code === '23503') {
        return response.notFound({
          message: 'Municipality not found',
        })
      }

      return response.internalServerError({
        message: 'Error updating tourist activity',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /tourist-activities/:id
   * Delete tourist activity
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.touristActivitiesService.deleteTouristActivity(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Tourist activity not found',
        })
      }

      return response.ok({
        message: 'Tourist activity deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting tourist activity',
        error: error.message,
      })
    }
  }
}
