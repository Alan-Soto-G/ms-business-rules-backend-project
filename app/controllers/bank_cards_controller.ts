// ============================================
// CONTROLADOR: app/controllers/bank_cards_controller.ts
// ============================================
import type { HttpContext } from '@adonisjs/core/http'
import BankCard from '#models/bank_card'
import { createBankCardValidator, updateBankCardValidator } from '#validators/bank_card'

export default class BankCardsController {
  // GET ALL
  public async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 20)

    // ⚠️ SEGURIDAD: No devolver información sensible completa
    const bankCards = await BankCard.query().paginate(page, perPage)
    return response.ok(bankCards)
  }

  // GET BY ID
  public async show({ params, response }: HttpContext) {
    const bankCard = await BankCard.findOrFail(params.id)
    await bankCard.load('client')

    // ⚠️ SEGURIDAD: Considera ocultar CVV y mostrar solo últimos 4 dígitos
    return response.ok(bankCard)
  }

  // CREATE
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createBankCardValidator)

    // ⚠️ RECOMENDACIÓN: Encriptar cardNumber y CVV antes de guardar
    const bankCard = await BankCard.create(data)
    return response.created(bankCard)
  }

  // UPDATE
  public async update({ params, request, response }: HttpContext) {
    const bankCard = await BankCard.findOrFail(params.id)
    const updates = await request.validateUsing(updateBankCardValidator)
    bankCard.merge(updates as any)
    await bankCard.save()
    return response.ok(bankCard)
  }

  // DELETE
  public async destroy({ params, response }: HttpContext) {
    const bankCard = await BankCard.findOrFail(params.id)
    await bankCard.delete()
    return response.ok({ message: 'Bank card deleted successfully' })
  }
}
