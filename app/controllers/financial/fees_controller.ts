import type { HttpContext } from '@adonisjs/core/http'
import FeesService from '#services/financial/fees_service'
import { createFeeValidator, updateFeeValidator } from '#validators/financial/fee'

export default class FeesController {
  private feesService: FeesService

  constructor() {
    this.feesService = new FeesService()
  }

  /**
   * GET /api/fees
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
   * GET /api/fees/my-installments
   * Get installments for authenticated user
   */
async myInstallments({ request, response }: HttpContext) {
  try {
    const authHeader = request.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.ok({
        message: 'No authenticated user',
        data: {
          clientId: null,
          installments: [],
        },
      })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // ✅ SOLO DECODIFICAR, NO VERIFICAR
    let decoded: any
    try {
      const payload = token.split('.')[1]
      const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8')
      decoded = JSON.parse(decodedPayload)
    } catch (error) {
      return response.ok({
        message: 'Invalid token',
        data: {
          clientId: null,
          installments: [],
        },
      })
    }

    const userId = decoded._id
    const Client = (await import('#models/core/client')).default
    const client = await Client.query().where('userId', userId).first()

    if (!client) {
      return response.ok({
        message: 'User is not a client',
        data: {
          clientId: null,
          installments: [],
        },
      })
    }

    const installments = await this.feesService.getUserInstallments(client.id)

    return response.ok({
      message: 'Installments retrieved successfully',
      data: {
        clientId: client.id,
        installments: installments,
      },
    })
  } catch (error) {
    return response.internalServerError({
      message: 'Error loading installments',
      error: error.message,
    })
  }
}

  /**
   * GET /api/fees/trip-client/:tripClientId
   * Get installments by trip client ID
   */
  async getByTripClient({ params, response }: HttpContext) {
    try {
      const fees = await this.feesService.getInstallmentsByTripClient(params.tripClientId)

      return response.ok({
        message: 'Installments retrieved successfully',
        data: fees,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving installments',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/fees/:id
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
   * POST /api/fees
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

      return response.internalServerError({
        message: 'Error creating fee',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /api/fees/:id
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

      return response.internalServerError({
        message: 'Error updating fee',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /api/fees/:id
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