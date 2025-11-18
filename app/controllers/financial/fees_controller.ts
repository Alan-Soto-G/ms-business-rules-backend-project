import type { HttpContext } from '@adonisjs/core/http'
import FeesService from '#services/financial/fees_service'
import { createFeeValidator, updateFeeValidator } from '#validators/financial/fee'

export default class FeesController {
  private feesService: FeesService

  constructor() {
    this.feesService = new FeesService()
  }

  /**
   * GET /fees
   * Get all fees with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const fees = await this.feesService.getAllFees(page, limit)

      return response.ok({
        message: 'Fees retrieved successfully',
        data: fees,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving fees',
        error: error.message,
      })
    }
  }

  /**
   * GET /fees/:id
   * Get fee by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const fee = await this.feesService.getFeeById(params.id)

      if (!fee) {
        return response.notFound({
          message: 'Fee not found',
        })
      }

      return response.ok({
        message: 'Fee retrieved successfully',
        data: fee,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving fee',
        error: error.message,
      })
    }
  }

  /**
   * POST /fees
   * Create new fee
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createFeeValidator)

      const fee = await this.feesService.createFee(data)

      return response.created({
        message: 'Fee created successfully',
        data: fee,
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
          message: 'Trip not found',
        })
      }

      return response.internalServerError({
        message: 'Error creating fee',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /fees/:id
   * Update fee
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateFeeValidator)

      const fee = await this.feesService.updateFee(params.id, data)

      if (!fee) {
        return response.notFound({
          message: 'Fee not found',
        })
      }

      return response.ok({
        message: 'Fee updated successfully',
        data: fee,
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
          message: 'Trip not found',
        })
      }

      return response.internalServerError({
        message: 'Error updating fee',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /fees/:id
   * Delete fee
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.feesService.deleteFee(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Fee not found',
        })
      }

      return response.ok({
        message: 'Fee deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting fee',
        error: error.message,
      })
    }
  }
}
