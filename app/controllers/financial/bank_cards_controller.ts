// ============================================
// CONTROLADOR: app/controllers/bank_cards_controller.ts
// ============================================
import type { HttpContext } from '@adonisjs/core/http'
import BankCardsService from '#services/financial/bank_cards_service'

export default class BankCardsController {
  private bankCardsService: BankCardsService

  constructor() {
    this.bankCardsService = new BankCardsService()
  }

  /**
   * Get all bank cards
   * GET /bank-cards
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const bankCards = await this.bankCardsService.findAll(page, perPage)
      return response.status(200).json(bankCards)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a bank card by ID
   * GET /bank-cards/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const bankCard = await this.bankCardsService.findById(params.id)
      return response.status(200).json(bankCard)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new bank card
   * POST /bank-cards
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const bankCard = await this.bankCardsService.create(data)
      return response.status(201).json(bankCard)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a bank card
   * PUT /bank-cards/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const bankCard = await this.bankCardsService.update(params.id, data)
      return response.status(200).json(bankCard)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a bank card
   * DELETE /bank-cards/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const bankCard = await this.bankCardsService.delete(params.id)
      return response.status(200).json(bankCard)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
