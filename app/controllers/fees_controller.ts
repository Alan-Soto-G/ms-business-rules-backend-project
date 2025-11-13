import type { HttpContext } from '@adonisjs/core/http'
import Fee from '#models/fee'
import { createFeeValidator, updateFeeValidator } from '#validators/fee'
import { DateTime } from 'luxon'

export default class FeesController {
  // GET ALL
  public async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 20)
    const fees = await Fee.query().paginate(page, perPage)
    return response.ok(fees)
  }

  // GET BY ID
  public async show({ params, response }: HttpContext) {
    const fee = await Fee.findOrFail(params.id)
    await fee.load('trip')
    await fee.load('invoices')
    return response.ok(fee)
  }

  // CREATE
  public async store({ request, response }: HttpContext) {
    const body = await request.validateUsing(createFeeValidator)

    const data = {
      tripId: body.tripId,
      amount: Number(body.amount),
      description: body.description,
      dueDate: DateTime.fromISO(`${body.dueDate}T00:00:00`),
      status: body.status,
    }

    console.log('📦 Datos a insertar Fee:', data)

    const fee = await Fee.create(data)
    return response.created(fee)
  }

  // UPDATE
  public async update({ params, request, response }: HttpContext) {
    const fee = await Fee.findOrFail(params.id)
    const updates = await request.validateUsing(updateFeeValidator)
    fee.merge(updates as any)
    await fee.save()
    return response.ok(fee)
  }

  // DELETE
  public async destroy({ params, response }: HttpContext) {
    const fee = await Fee.findOrFail(params.id)
    await fee.delete()
    return response.ok({ message: 'Fee deleted successfully' })
  }
}
