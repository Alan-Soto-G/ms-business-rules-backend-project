import type { HttpContext } from '@adonisjs/core/http'
import PlanActivitiesService from '#services/tourism/plan_activities_service'
import {
  createPlanActivityValidator,
  updatePlanActivityValidator,
  assignPlanActivityValidator,
} from '#validators/tourism/plan_activity'

export default class PlanActivitiesController {
  private planActivitiesService: PlanActivitiesService

  constructor() {
    this.planActivitiesService = new PlanActivitiesService()
  }

  /**
   * GET /plan-activities
   * Get all plan activities with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const planActivities = await this.planActivitiesService.getAllPlanActivities(page, limit)

      return response.ok({
        message: 'Plan activities retrieved successfully',
        data: planActivities,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving plan activities',
        error: error.message,
      })
    }
  }

  /**
   * GET /plan-activities/:id
   * Get plan activity by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const planActivity = await this.planActivitiesService.getPlanActivityById(params.id)

      if (!planActivity) {
        return response.notFound({
          message: 'Plan activity not found',
        })
      }

      return response.ok({
        message: 'Plan activity retrieved successfully',
        data: planActivity,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving plan activity',
        error: error.message,
      })
    }
  }

  /**
   * GET /plan-activities/plan/:planId
   * Get all activities by plan
   */
  async getByPlan({ params, response }: HttpContext) {
    try {
      const activities = await this.planActivitiesService.getActivitiesByPlan(params.planId)

      return response.ok({
        message: 'Activities by plan retrieved successfully',
        data: activities,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving activities by plan',
        error: error.message,
      })
    }
  }

  /**
   * GET /plan-activities/activity/:activityId
   * Get all plans by activity
   */
  async getByActivity({ params, response }: HttpContext) {
    try {
      const plans = await this.planActivitiesService.getPlansByActivity(params.activityId)

      return response.ok({
        message: 'Plans by activity retrieved successfully',
        data: plans,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving plans by activity',
        error: error.message,
      })
    }
  }

  /**
   * POST /plan-activities
   * Create new plan activity
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createPlanActivityValidator)

      const planActivity = await this.planActivitiesService.createPlanActivity(data)

      return response.created({
        message: 'Plan activity created successfully',
        data: planActivity,
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
        message: 'Error creating plan activity',
        error: error.message,
      })
    }
  }

  /**
   * POST /plan-activities/assign
   * Assign activity to plan
   */
  async assign({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(assignPlanActivityValidator)

      const planActivity = await this.planActivitiesService.assignPlanActivity(data)

      return response.created({
        message: 'Activity assigned to plan successfully',
        data: planActivity,
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
        message: 'Error assigning activity to plan',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /plan-activities/unassign/:planId/:activityId
   * Unassign activity from plan
   */
  async unassign({ params, response }: HttpContext) {
    try {
      const deleted = await this.planActivitiesService.unassignPlanActivity(
        params.planId,
        params.activityId
      )

      if (!deleted) {
        return response.notFound({
          message: 'Plan activity assignment not found',
        })
      }

      return response.ok({
        message: 'Activity unassigned from plan successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error unassigning activity from plan',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /plan-activities/:id
   * Update plan activity
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updatePlanActivityValidator)

      const planActivity = await this.planActivitiesService.updatePlanActivity(params.id, data)

      if (!planActivity) {
        return response.notFound({
          message: 'Plan activity not found',
        })
      }

      return response.ok({
        message: 'Plan activity updated successfully',
        data: planActivity,
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
        message: 'Error updating plan activity',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /plan-activities/:id
   * Delete plan activity
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.planActivitiesService.deletePlanActivity(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Plan activity not found',
        })
      }

      return response.ok({
        message: 'Plan activity deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting plan activity',
        error: error.message,
      })
    }
  }
}
