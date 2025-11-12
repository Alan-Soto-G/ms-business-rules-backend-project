// app/controllers/fees_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Fee from '#models/fee'
import { createFeeValidator, updateFeeValidator } from '#validators/fee'

/**
 * Controlador de Fees (Cuotas)
 *
 * Contiene los métodos CRUD básicos expuestos por la API:
 * - find: obtener una o varias cuotas (con paginación opcional)
 * - create: crear una nueva cuota
 * - update: actualizar campos permitidos de una cuota existente
 * - delete: eliminar una cuota
 * - findByTrip: obtener cuotas de un viaje específico
 */
export default class FeesController {
  /**
   * Obtener una cuota individual o una lista paginada.
   *
   * Comportamiento:
   * - Si `params.id` está presente, busca la cuota por id y la devuelve con sus relaciones.
   * - Si no hay `params.id`, comprueba si la request contiene `page` y `per_page` y
   *   devuelve una respuesta paginada.
   * - Si no hay parámetros, devuelve todas las cuotas.
   *
   * @param {HttpContext} ctx - Contexto HTTP (request, response, params)
   * @returns {Promise<any>} Respuesta HTTP con la cuota o la página de resultados
   */
  public async find({ response, request, params }: HttpContext) {
    if (params.id) {
      const theFee: Fee = await Fee.findOrFail(params.id)
      await theFee.load('trip')
      await theFee.load('invoices')
      return response.status(200).json(theFee)
    } else {
      const data = request.all()
      if ('page' in data && 'per_page' in data) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const fees = await Fee.query().preload('trip').paginate(page, perPage)
        return response.status(200).json(fees)
      }

      const allFees = await Fee.query().preload('trip')
      return response.status(200).json(allFees)
    }
  }

  /**
   * Crear una nueva cuota.
   *
   * @param {HttpContext} ctx - Contexto HTTP (request, response)
   * @returns {Promise<any>} 201 con la cuota creada o 500 en error interno
   */
  public async create({ request, response }: HttpContext) {
    const body = await request.validateUsing(createFeeValidator)
    const theFee: Fee = await Fee.create(body)
    if (!theFee) {
      return response.status(500).json({ message: 'Error creating fee' })
    }
    return response.status(201).json(theFee)
  }

  /**
   * Actualizar una cuota existente.
   *
   * @param {HttpContext} ctx - Contexto HTTP (params, request, response)
   * @returns {Promise<any>} 200 con la cuota actualizada o 400 si falta id
   */
  public async update({ params, request, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const theFee: Fee = await Fee.findOrFail(params.id)

    const updates = await request.validateUsing(updateFeeValidator)

    theFee.merge(updates)
    await theFee.save()

    return response.status(200).json(theFee)
  }

  /**
   * Eliminar una cuota por id.
   *
   * @param {HttpContext} ctx - Contexto HTTP (params, response)
   * @returns {Promise<any>} 200 con mensaje de éxito o 400 si falta id
   */
  public async delete({ params, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const theFee: Fee = await Fee.findOrFail(params.id)
    await theFee.delete()
    return response.status(200).json({ message: 'Fee deleted successfully' })
  }

  /**
   * Obtener cuotas de un viaje específico.
   *
   * @param {HttpContext} ctx - Contexto HTTP (params, response)
   * @returns {Promise<any>} 200 con las cuotas del viaje
   */
  public async findByTrip({ params, response }: HttpContext) {
    if (!params.tripId) {
      return response.status(400).json({ message: 'Missing tripId parameter' })
    }

    const fees = await Fee.query().where('trip_id', params.tripId).preload('invoices')
    return response.status(200).json(fees)
  }
}
