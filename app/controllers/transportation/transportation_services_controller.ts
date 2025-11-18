import type { HttpContext } from '@adonisjs/core/http'
import TransportationServicesService from '#services/transportation/transportation_services_service'
import {
  createTransportationServiceValidator,
  updateTransportationServiceValidator,
  assignTransportationServiceValidator,
} from '#validators/transportation/transport_service'
import { DateTime } from 'luxon'

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
   * Get all transportation services by journey
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
   * Get all transportation services by vehicle
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
      const validatedData = await request.validateUsing(createTransportationServiceValidator)

      // Convert Date to DateTime
      const data = {
        ...validatedData,
        startDate: DateTime.fromJSDate(validatedData.startDate),
        endDate: DateTime.fromJSDate(validatedData.endDate),
      }

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

      if (error.message.includes('End date must be after start date')) {
        return response.badRequest({
          message: error.message,
        })
      }

      if (error.code === '23503') {
        return response.badRequest({
          message: 'Invalid journey ID or vehicle ID',
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
   * Assign transportation service between journey and vehicle
   */
  async assign({ request, response }: HttpContext) {
    try {
      const validatedData = await request.validateUsing(assignTransportationServiceValidator)

      // Convert Date to DateTime
      const data = {
        ...validatedData,
        startDate: DateTime.fromJSDate(validatedData.startDate),
        endDate: DateTime.fromJSDate(validatedData.endDate),
      }

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

      if (error.message.includes('End date must be after start date')) {
        return response.badRequest({
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
   * Unassign transportation service between journey and vehicle
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
      const validatedData = await request.validateUsing(updateTransportationServiceValidator)

      // Convert Date to DateTime if dates are provided
      const data = {
        ...validatedData,
        startDate: validatedData.startDate
          ? DateTime.fromJSDate(validatedData.startDate)
          : undefined,
        endDate: validatedData.endDate ? DateTime.fromJSDate(validatedData.endDate) : undefined,
      }

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

      if (error.message.includes('End date must be after start date')) {
        return response.badRequest({
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
