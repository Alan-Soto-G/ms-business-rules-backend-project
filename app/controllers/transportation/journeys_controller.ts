import type { HttpContext } from '@adonisjs/core/http'
import JourneysService from '#services/transportation/journeys_service'
import {
  createJourneyValidator,
  updateJourneyValidator,
  assignJourneyValidator,
} from '#validators/transportation/journey'

export default class JourneysController {
  private journeysService: JourneysService

  constructor() {
    this.journeysService = new JourneysService()
  }

  /**
   * GET /journeys
   * Get all journeys with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const journeys = await this.journeysService.getAllJourneys(page, limit)

      return response.ok({
        message: 'Journeys retrieved successfully',
        data: journeys,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving journeys',
        error: error.message,
      })
    }
  }

  /**
   * GET /journeys/:id
   * Get journey by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const journey = await this.journeysService.getJourneyById(params.id)

      if (!journey) {
        return response.notFound({
          message: 'Journey not found',
        })
      }

      return response.ok({
        message: 'Journey retrieved successfully',
        data: journey,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving journey',
        error: error.message,
      })
    }
  }

  /**
   * GET /journeys/origin/:municipalityId
   * Get all journeys from a specific origin municipality
   */
  async getByOrigin({ params, response }: HttpContext) {
    try {
      const journeys = await this.journeysService.getJourneysByOrigin(params.municipalityId)

      return response.ok({
        message: 'Journeys by origin retrieved successfully',
        data: journeys,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving journeys by origin',
        error: error.message,
      })
    }
  }

  /**
   * GET /journeys/destination/:municipalityId
   * Get all journeys to a specific destination municipality
   */
  async getByDestination({ params, response }: HttpContext) {
    try {
      const journeys = await this.journeysService.getJourneysByDestination(params.municipalityId)

      return response.ok({
        message: 'Journeys by destination retrieved successfully',
        data: journeys,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving journeys by destination',
        error: error.message,
      })
    }
  }

  /**
   * POST /journeys
   * Create new journey
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createJourneyValidator)

      const journey = await this.journeysService.createJourney(data)

      return response.created({
        message: 'Journey created successfully',
        data: journey,
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

      if (error.message.includes('already exists')) {
        return response.conflict({
          message: error.message,
        })
      }

      if (error.code === '23503') {
        return response.badRequest({
          message: 'Invalid municipality ID',
        })
      }

      return response.internalServerError({
        message: 'Error creating journey',
        error: error.message,
      })
    }
  }

  /**
   * POST /journeys/assign
   * Assign journey between two municipalities
   */
  async assign({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(assignJourneyValidator)

      const journey = await this.journeysService.assignJourney(data)

      return response.created({
        message: 'Journey assigned successfully',
        data: journey,
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

      if (error.message.includes('already exists')) {
        return response.conflict({
          message: error.message,
        })
      }

      return response.internalServerError({
        message: 'Error assigning journey',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /journeys/unassign/:originId/:destinationId
   * Unassign journey between two municipalities
   */
  async unassign({ params, response }: HttpContext) {
    try {
      const deleted = await this.journeysService.unassignJourney(
        params.originId,
        params.destinationId
      )

      if (!deleted) {
        return response.notFound({
          message: 'Journey not found',
        })
      }

      return response.ok({
        message: 'Journey unassigned successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error unassigning journey',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /journeys/:id
   * Update journey
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateJourneyValidator)

      const journey = await this.journeysService.updateJourney(params.id, data)

      if (!journey) {
        return response.notFound({
          message: 'Journey not found',
        })
      }

      return response.ok({
        message: 'Journey updated successfully',
        data: journey,
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

      if (error.message.includes('already exists')) {
        return response.conflict({
          message: error.message,
        })
      }

      return response.internalServerError({
        message: 'Error updating journey',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /journeys/:id
   * Delete journey
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.journeysService.deleteJourney(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Journey not found',
        })
      }

      return response.ok({
        message: 'Journey deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting journey',
        error: error.message,
      })
    }
  }
}
