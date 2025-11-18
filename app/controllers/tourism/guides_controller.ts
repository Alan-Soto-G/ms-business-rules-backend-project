import type { HttpContext } from '@adonisjs/core/http'
import GuidesService from '#services/tourism/guides_service'
import { createGuideValidator, updateGuideValidator } from '#validators/tourism/guide'

export default class GuidesController {
  private guidesService: GuidesService

  constructor() {
    this.guidesService = new GuidesService()
  }

  /**
   * GET /guides
   * Get all guides with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const guides = await this.guidesService.getAllGuides(page, limit)

      return response.ok({
        message: 'Guides retrieved successfully',
        data: guides,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving guides',
        error: error.message,
      })
    }
  }

  /**
   * GET /guides/:id
   * Get guide by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const guide = await this.guidesService.getGuideById(params.id)

      if (!guide) {
        return response.notFound({
          message: 'Guide not found',
        })
      }

      return response.ok({
        message: 'Guide retrieved successfully',
        data: guide,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving guide',
        error: error.message,
      })
    }
  }

  /**
   * POST /guides
   * Create new guide
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createGuideValidator)

      const guide = await this.guidesService.createGuide(data)

      return response.created({
        message: 'Guide created successfully',
        data: guide,
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
          message: 'User ID or license number already exists',
        })
      }

      return response.internalServerError({
        message: 'Error creating guide',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /guides/:id
   * Update guide
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateGuideValidator)

      const guide = await this.guidesService.updateGuide(params.id, data)

      if (!guide) {
        return response.notFound({
          message: 'Guide not found',
        })
      }

      return response.ok({
        message: 'Guide updated successfully',
        data: guide,
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
          message: 'User ID or license number already exists',
        })
      }

      return response.internalServerError({
        message: 'Error updating guide',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /guides/:id
   * Delete guide
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.guidesService.deleteGuide(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Guide not found',
        })
      }

      return response.ok({
        message: 'Guide deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting guide',
        error: error.message,
      })
    }
  }
}
