import type { HttpContext } from '@adonisjs/core/http'
import TripPlansService from '#services/pivots/trip_plans_service'
import {
  createTripPlanValidator,
  updateTripPlanValidator,
  assignTripPlanValidator,
} from '#validators/pivots/trip_plan'

export default class TripPlansController {
  private tripPlansService: TripPlansService

  constructor() {
    this.tripPlansService = new TripPlansService()
  }

  /**
   * GET /trip-plans
   * Get all trip plans with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const tripPlans = await this.tripPlansService.getAllTripPlans(page, limit)

      return response.ok({
        message: 'Trip plans retrieved successfully',
        data: tripPlans,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving trip plans',
        error: error.message,
      })
    }
  }

  /**
   * GET /trip-plans/:id
   * Get trip plan by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const tripPlan = await this.tripPlansService.getTripPlanById(params.id)

      if (!tripPlan) {
        return response.notFound({
          message: 'Trip plan not found',
        })
      }

      return response.ok({
        message: 'Trip plan retrieved successfully',
        data: tripPlan,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving trip plan',
        error: error.message,
      })
    }
  }

  /**
   * GET /trip-plans/trip/:tripId
   * Get all plans by trip
   */
  async getByTrip({ params, response }: HttpContext) {
    try {
      const plans = await this.tripPlansService.getPlansByTrip(params.tripId)

      return response.ok({
        message: 'Plans by trip retrieved successfully',
        data: plans,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving plans by trip',
        error: error.message,
      })
    }
  }

  /**
   * GET /trip-plans/plan/:planId
   * Get all trips by plan
   */
  async getByPlan({ params, response }: HttpContext) {
    try {
      const trips = await this.tripPlansService.getTripsByPlan(params.planId)

      return response.ok({
        message: 'Trips by plan retrieved successfully',
        data: trips,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving trips by plan',
        error: error.message,
      })
    }
  }

  /**
   * POST /trip-plans
   * Create new trip plan
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createTripPlanValidator)

      const tripPlan = await this.tripPlansService.createTripPlan(data)

      return response.created({
        message: 'Trip plan created successfully',
        data: tripPlan,
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
        message: 'Error creating trip plan',
        error: error.message,
      })
    }
  }

  /**
   * POST /trip-plans/assign
   * Assign plan to trip
   */
  async assign({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(assignTripPlanValidator)

      const tripPlan = await this.tripPlansService.assignTripPlan(data)

      return response.created({
        message: 'Plan assigned to trip successfully',
        data: tripPlan,
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
        message: 'Error assigning plan to trip',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /trip-plans/unassign/:tripId/:planId
   * Unassign plan from trip
   */
  async unassign({ params, response }: HttpContext) {
    try {
      const deleted = await this.tripPlansService.unassignTripPlan(params.tripId, params.planId)

      if (!deleted) {
        return response.notFound({
          message: 'Trip plan assignment not found',
        })
      }

      return response.ok({
        message: 'Plan unassigned from trip successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error unassigning plan from trip',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /trip-plans/:id
   * Update trip plan
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateTripPlanValidator)

      const tripPlan = await this.tripPlansService.updateTripPlan(params.id, data)

      if (!tripPlan) {
        return response.notFound({
          message: 'Trip plan not found',
        })
      }

      return response.ok({
        message: 'Trip plan updated successfully',
        data: tripPlan,
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
        message: 'Error updating trip plan',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /trip-plans/:id
   * Delete trip plan
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.tripPlansService.deleteTripPlan(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Trip plan not found',
        })
      }

      return response.ok({
        message: 'Trip plan deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting trip plan',
        error: error.message,
      })
    }
  }
}
