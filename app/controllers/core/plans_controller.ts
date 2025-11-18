import type { HttpContext } from '@adonisjs/core/http'
import PlansService from '#services/core/plans_service'
import { createPlanValidator, updatePlanValidator } from '#validators/core/plan'

export default class PlansController {
  private plansService: PlansService

  constructor() {
    this.plansService = new PlansService()
  }

  /**
   * GET /plans
   * Get all plans with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const plans = await this.plansService.getAllPlans(page, limit)

      return response.ok({
        message: 'Plans retrieved successfully',
        data: plans,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving plans',
        error: error.message,
      })
    }
  }

  /**
   * GET /plans/:id
   * Get plan by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const plan = await this.plansService.getPlanById(params.id)

      if (!plan) {
        return response.notFound({
          message: 'Plan not found',
        })
      }

      return response.ok({
        message: 'Plan retrieved successfully',
        data: plan,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving plan',
        error: error.message,
      })
    }
  }

  /**
   * POST /plans
   * Create new plan
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createPlanValidator)

      const plan = await this.plansService.createPlan(data)

      return response.created({
        message: 'Plan created successfully',
        data: plan,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Error creating plan',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /plans/:id
   * Update plan
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updatePlanValidator)

      const plan = await this.plansService.updatePlan(params.id, data)

      if (!plan) {
        return response.notFound({
          message: 'Plan not found',
        })
      }

      return response.ok({
        message: 'Plan updated successfully',
        data: plan,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        message: 'Error updating plan',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /plans/:id
   * Delete plan
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.plansService.deletePlan(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Plan not found',
        })
      }

      return response.ok({
        message: 'Plan deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting plan',
        error: error.message,
      })
    }
  }
}
