import type { HttpContext } from '@adonisjs/core/http'
import Fee from '#models/fee'
import { createFeeValidator, updateFeeValidator } from '#validators/fee'
import { DateTime } from 'luxon'

export default class FeesController {
  // GET ALL or GET BY ID
  public async find({ request, response, params }: HttpContext) {
    if (params.id) {
      const fee = await Fee.findOrFail(params.id)
      await fee.load('trip')
      await fee.load('invoices')
      return response.status(200).json(fee)
    } else {
      const dataFees = request.all()
      if ('page' in dataFees && 'per_page' in dataFees) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const fees = await Fee.query().paginate(page, perPage)
        return response.status(200).json(fees)
      }
      const allFees = await Fee.query()
      return response.status(200).json(allFees)
    }
  }

  // CREATE
  public async create({ request, response }: HttpContext) {
    const body = await request.validateUsing(createFeeValidator)

    const data = {
      tripId: body.tripId,
      amount: Number(body.amount),
      description: body.description,
      dueDate: DateTime.fromISO(`${body.dueDate}T00:00:00`),
      status: body.status,
    }

    const fee = await Fee.create(data)
    await fee.load('trip')
    return response.status(201).json(fee)
  }

  // UPDATE
  public async update({ params, request, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const fee = await Fee.findOrFail(params.id)
    const updates = await request.validateUsing(updateFeeValidator)
    fee.merge(updates as any)
    await fee.save()
    await fee.load('trip')
    return response.status(200).json(fee)
  }

  // DELETE
  public async delete({ params, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const fee = await Fee.findOrFail(params.id)
    await fee.delete()
    return response.status(200).json({ message: 'Fee deleted successfully' })
  }
}
