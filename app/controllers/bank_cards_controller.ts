// ============================================
// CONTROLADOR: app/controllers/bank_cards_controller.ts
// ============================================
import type { HttpContext } from '@adonisjs/core/http'
import BankCard from '#models/bank_card'
import { createBankCardValidator, updateBankCardValidator } from '#validators/bank_card'
import { DateTime } from 'luxon'

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
    const body = await request.validateUsing(createBankCardValidator)

    const data = {
      clientId: body.clientId,
      cardNumber: body.cardNumber,
      cvv: body.cvv,
      expirationDate: DateTime.fromISO(`${body.expirationDate}T00:00:00`),
      cardHolderName: body.cardHolderName,
    }

    console.log('📦 Datos a insertar BankCard:', {
      ...data,
      cardNumber: '****' + data.cardNumber.slice(-4), // Log seguro
      cvv: '***', // Log seguro
    })

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
