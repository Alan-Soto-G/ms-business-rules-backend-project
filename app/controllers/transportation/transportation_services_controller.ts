import type { HttpContext } from '@adonisjs/core/http'
import TransportationServicesService from '#services/transportation/transportation_services_service'
import {
  createTransportationServiceValidator,
  updateTransportationServiceValidator,
  assignTransportationServiceValidator,
} from '#validators/transportation/transport_service'

export default class TransportationServicesController {
  private transportationServicesService: TransportationServicesService

  constructor() {
    this.transportationServicesService = new TransportationServicesService()
  }

  /**
   * GET /transportation-services
   * Get all transportation services with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const services = await this.transportationServicesService.getAllTransportationServices(
        page,
        limit
      )

      return response.ok({
        message: 'Transportation services retrieved successfully',
        data: services,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving transportation services',
        error: error.message,
      })
    }
  }

  /**
   * GET /transportation-services/:id
   * Get transportation service by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const service = await this.transportationServicesService.getTransportationServiceById(
        params.id
      )

      if (!service) {
        return response.notFound({
          message: 'Transportation service not found',
        })
      }

      return response.ok({
        message: 'Transportation service retrieved successfully',
        data: service,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving transportation service',
        error: error.message,
      })
    }
  }

  /**
   * GET /transportation-services/journey/:journeyId
   * Get all transportation services for a specific journey
   */
  async getByJourney({ params, response }: HttpContext) {
    try {
      const services = await this.transportationServicesService.getTransportationServicesByJourney(
        params.journeyId
      )

      return response.ok({
        message: 'Transportation services by journey retrieved successfully',
        data: services,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving transportation services by journey',
        error: error.message,
      })
    }
  }

  /**
   * GET /transportation-services/vehicle/:vehicleId
   * Get all transportation services for a specific vehicle
   */
  async getByVehicle({ params, response }: HttpContext) {
    try {
      const services = await this.transportationServicesService.getTransportationServicesByVehicle(
        params.vehicleId
      )

      return response.ok({
        message: 'Transportation services by vehicle retrieved successfully',
        data: services,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving transportation services by vehicle',
        error: error.message,
      })
    }
  }

  /**
   * POST /transportation-services
   * Create new transportation service
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createTransportationServiceValidator)

      const service = await this.transportationServicesService.createTransportationService(data)

      return response.created({
        message: 'Transportation service created successfully',
        data: service,
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
          message: 'Invalid journey or vehicle ID',
        })
      }

      return response.internalServerError({
        message: 'Error creating transportation service',
        error: error.message,
      })
    }
  }

  /**
   * POST /transportation-services/assign
   * Assign a vehicle to a journey creating a transportation service
   */
  async assign({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(assignTransportationServiceValidator)

      const service = await this.transportationServicesService.assignTransportationService(data)

      return response.created({
        message: 'Transportation service assigned successfully',
        data: service,
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
        message: 'Error assigning transportation service',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /transportation-services/unassign/:journeyId/:vehicleId
   * Unassign a vehicle from a journey
   */
  async unassign({ params, response }: HttpContext) {
    try {
      const deleted = await this.transportationServicesService.unassignTransportationService(
        params.journeyId,
        params.vehicleId
      )

      if (!deleted) {
        return response.notFound({
          message: 'Transportation service not found',
        })
      }

      return response.ok({
        message: 'Transportation service unassigned successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error unassigning transportation service',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /transportation-services/:id
   * Update transportation service
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateTransportationServiceValidator)

      const service = await this.transportationServicesService.updateTransportationService(
        params.id,
        data
      )

      if (!service) {
        return response.notFound({
          message: 'Transportation service not found',
        })
      }

      return response.ok({
        message: 'Transportation service updated successfully',
        data: service,
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
        message: 'Error updating transportation service',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /transportation-services/:id
   * Delete transportation service
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.transportationServicesService.deleteTransportationService(
        params.id
      )

      if (!deleted) {
        return response.notFound({
          message: 'Transportation service not found',
        })
      }

      return response.ok({
        message: 'Transportation service deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting transportation service',
        error: error.message,
      })
    }
  }
}