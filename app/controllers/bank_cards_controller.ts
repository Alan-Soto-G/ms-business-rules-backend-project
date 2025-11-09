import type { HttpContext } from '@adonisjs/core/http'
import BankCard from '#models/bank_card'
import { createBankCardValidator, updateBankCardValidator } from '#validators/bank_card'

export default class BankCardsController {
  /** GET /bank-cards  */
  public async index({ response, request }: HttpContext) {
    const data = request.all()

    if ('page' in data && 'per_page' in data) {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 20)
      const bankCards = await BankCard.query().preload('client').paginate(page, perPage)
      return response.status(200).json(bankCards)
    }

    const allBankCards = await BankCard.query().preload('client')
    return response.status(200).json(allBankCards)
  }

  /** GET /bank-cards/:id */
  public async show({ params, response }: HttpContext) {
    const bankCard = await BankCard.findOrFail(params.id)
    await bankCard.load('client')
    return response.status(200).json(bankCard)
  }

  /** POST /bank-cards */
  public async store({ request, response }: HttpContext) {
    const body = await request.validateUsing(createBankCardValidator)
    const bankCard = await BankCard.create(body)
    return response.status(201).json(bankCard)
  }

  /** PUT/PATCH /bank-cards/:id */
  public async update({ params, request, response }: HttpContext) {
    const bankCard = await BankCard.findOrFail(params.id)
    const updates = await request.validateUsing(updateBankCardValidator)

    bankCard.merge(updates)
    await bankCard.save()

    return response.status(200).json(bankCard)
  }

  /** DELETE /bank-cards/:id */
  public async destroy({ params, response }: HttpContext) {
    const bankCard = await BankCard.findOrFail(params.id)
    await bankCard.delete()
    return response.status(200).json({ message: 'Bank card deleted successfully' })
  }

  /** ⚠ Ruta extra (fuera del resource): GET /bank-cards/client/:clientId */
  public async findByClient({ params, response }: HttpContext) {
    const bankCards = await BankCard.query().where('client_id', params.clientId)
    return response.status(200).json(bankCards)
  }
}
