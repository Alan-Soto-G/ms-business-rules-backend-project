import type { HttpContext } from '@adonisjs/core/http'
import GuideActivitiesService from '#services/tourism/guide_activities_service'
import {
  createGuideActivityValidator,
  updateGuideActivityValidator,
  assignGuideActivityValidator,
} from '#validators/tourism/guide_activity'
import { DateTime } from 'luxon'

export default class GuideActivitiesController {
  private guideActivitiesService: GuideActivitiesService

  constructor() {
    this.guideActivitiesService = new GuideActivitiesService()
  }

  /**
   * GET /guide-activities
   * Get all guide activities with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const guideActivities = await this.guideActivitiesService.getAllGuideActivities(page, limit)

      return response.ok({
        message: 'Guide activities retrieved successfully',
        data: guideActivities,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving guide activities',
        error: error.message,
      })
    }
  }

  /**
   * GET /guide-activities/:id
   * Get guide activity by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const guideActivity = await this.guideActivitiesService.getGuideActivityById(params.id)

      if (!guideActivity) {
        return response.notFound({
          message: 'Guide activity not found',
        })
      }

      return response.ok({
        message: 'Guide activity retrieved successfully',
        data: guideActivity,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving guide activity',
        error: error.message,
      })
    }
  }

  /**
   * GET /guide-activities/guide/:guideId
   * Get all activities by guide
   */
  async getByGuide({ params, response }: HttpContext) {
    try {
      const activities = await this.guideActivitiesService.getActivitiesByGuide(params.guideId)

      return response.ok({
        message: 'Activities by guide retrieved successfully',
        data: activities,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving activities by guide',
        error: error.message,
      })
    }
  }

  /**
   * GET /guide-activities/activity/:activityId
   * Get all guides by activity
   */
  async getByActivity({ params, response }: HttpContext) {
    try {
      const guides = await this.guideActivitiesService.getGuidesByActivity(params.activityId)

      return response.ok({
        message: 'Guides by activity retrieved successfully',
        data: guides,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving guides by activity',
        error: error.message,
      })
    }
  }

  /**
   * POST /guide-activities
   * Create new guide activity
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createGuideActivityValidator)

      const guideActivity = await this.guideActivitiesService.createGuideActivity({
        guide_id: data.guide_id,
        activity_id: data.activity_id,
        assignment_date: data.assignment_date
          ? DateTime.fromJSDate(data.assignment_date)
          : undefined,
      })

      return response.created({
        message: 'Guide activity created successfully',
        data: guideActivity,
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
        message: 'Error creating guide activity',
        error: error.message,
      })
    }
  }

  /**
   * POST /guide-activities/assign
   * Assign guide to activity
   */
  async assign({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(assignGuideActivityValidator)

      const guideActivity = await this.guideActivitiesService.assignGuideActivity({
        guide_id: data.guide_id,
        activity_id: data.activity_id,
        assignment_date: data.assignment_date
          ? DateTime.fromJSDate(data.assignment_date)
          : undefined,
      })

      return response.created({
        message: 'Guide assigned to activity successfully',
        data: guideActivity,
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
        message: 'Error assigning guide to activity',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /guide-activities/unassign/:guideId/:activityId
   * Unassign guide from activity
   */
  async unassign({ params, response }: HttpContext) {
    try {
      const deleted = await this.guideActivitiesService.unassignGuideActivity(
        params.guideId,
        params.activityId
      )

      if (!deleted) {
        return response.notFound({
          message: 'Guide activity assignment not found',
        })
      }

      return response.ok({
        message: 'Guide unassigned from activity successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error unassigning guide from activity',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /guide-activities/:id
   * Update guide activity
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateGuideActivityValidator)

      const guideActivity = await this.guideActivitiesService.updateGuideActivity(params.id, {
        guide_id: data.guide_id,
        activity_id: data.activity_id,
        assignment_date: data.assignment_date
          ? DateTime.fromJSDate(data.assignment_date)
          : undefined,
      })

      if (!guideActivity) {
        return response.notFound({
          message: 'Guide activity not found',
        })
      }

      return response.ok({
        message: 'Guide activity updated successfully',
        data: guideActivity,
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
        message: 'Error updating guide activity',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /guide-activities/:id
   * Delete guide activity
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.guideActivitiesService.deleteGuideActivity(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Guide activity not found',
        })
      }

      return response.ok({
        message: 'Guide activity deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting guide activity',
        error: error.message,
      })
    }
  }
}
