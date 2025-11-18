import type { HttpContext } from '@adonisjs/core/http'
import MunicipalitiesService from '#services/core/municipalities_service'
import {
  createMunicipalityValidator,
  updateMunicipalityValidator,
} from '#validators/core/municipality'

export default class MunicipalitiesController {
  private municipalitiesService: MunicipalitiesService

  constructor() {
    this.municipalitiesService = new MunicipalitiesService()
  }

  /**
   * GET /municipalities
   * Get all municipalities with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const municipalities = await this.municipalitiesService.getAllMunicipalities(page, limit)

      return response.ok({
        message: 'Municipalities retrieved successfully',
        data: municipalities,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving municipalities',
        error: error.message,
      })
    }
  }

  /**
   * GET /municipalities/:id
   * Get municipality by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const municipality = await this.municipalitiesService.getMunicipalityById(params.id)

      if (!municipality) {
        return response.notFound({
          message: 'Municipality not found',
        })
      }

      return response.ok({
        message: 'Municipality retrieved successfully',
        data: municipality,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving municipality',
        error: error.message,
      })
    }
  }

  /**
   * POST /municipalities
   * Create new municipality
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createMunicipalityValidator)

      const municipality = await this.municipalitiesService.createMunicipality(data)

      return response.created({
        message: 'Municipality created successfully',
        data: municipality,
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
          message: 'Municipality code already exists',
        })
      }

      return response.internalServerError({
        message: 'Error creating municipality',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /municipalities/:id
   * Update municipality
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateMunicipalityValidator)

      const municipality = await this.municipalitiesService.updateMunicipality(params.id, data)

      if (!municipality) {
        return response.notFound({
          message: 'Municipality not found',
        })
      }

      return response.ok({
        message: 'Municipality updated successfully',
        data: municipality,
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
          message: 'Municipality code already exists',
        })
      }

      return response.internalServerError({
        message: 'Error updating municipality',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /municipalities/:id
   * Delete municipality
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.municipalitiesService.deleteMunicipality(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Municipality not found',
        })
      }

      return response.ok({
        message: 'Municipality deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting municipality',
        error: error.message,
      })
    }
  }
}
