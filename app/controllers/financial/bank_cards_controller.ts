import type { HttpContext } from '@adonisjs/core/http'
import BankCardsService from '#services/financial/bank_cards_service'
import { createBankCardValidator, updateBankCardValidator } from '#validators/financial/bank_card'

export default class BankCardsController {
  private bankCardsService: BankCardsService

  constructor() {
    this.bankCardsService = new BankCardsService()
  }

  /**
   * GET /bank-cards
   * Get all bank cards with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const bankCards = await this.bankCardsService.getAllBankCards(page, limit)

      return response.ok({
        message: 'Bank cards retrieved successfully',
        data: bankCards,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving bank cards',
        error: error.message,
      })
    }
  }

  /**
   * GET /bank-cards/:id
   * Get bank card by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const bankCard = await this.bankCardsService.getBankCardById(params.id)

      if (!bankCard) {
        return response.notFound({
          message: 'Bank card not found',
        })
      }

      return response.ok({
        message: 'Bank card retrieved successfully',
        data: bankCard,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving bank card',
        error: error.message,
      })
    }
  }

  /**
   * POST /bank-cards
   * Create new bank card
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createBankCardValidator)

      const bankCard = await this.bankCardsService.createBankCard(data)

      return response.created({
        message: 'Bank card created successfully',
        data: bankCard,
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
          message: 'Client not found',
        })
      }

      return response.internalServerError({
        message: 'Error creating bank card',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /bank-cards/:id
   * Update bank card
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateBankCardValidator)

      const bankCard = await this.bankCardsService.updateBankCard(params.id, data)

      if (!bankCard) {
        return response.notFound({
          message: 'Bank card not found',
        })
      }

      return response.ok({
        message: 'Bank card updated successfully',
        data: bankCard,
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
          message: 'Client not found',
        })
      }

      return response.internalServerError({
        message: 'Error updating bank card',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /bank-cards/:id
   * Delete bank card
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.bankCardsService.deleteBankCard(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Bank card not found',
        })
      }

      return response.ok({
        message: 'Bank card deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting bank card',
        error: error.message,
      })
    }
  }
}
