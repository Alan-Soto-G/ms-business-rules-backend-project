import type { HttpContext } from '@adonisjs/core/http'
import Gps from '#models/gps'
import { createGpsValidator, updateGpsValidator } from '#validators/gps'

export default class GpsController {
  /**
   * Obtener un GPS individual o una lista paginada.
   */
  public async find({ response, request, params }: HttpContext) {
    if (params.id) {
      const theGps: Gps = await Gps.findOrFail(params.id)
      await theGps.load('vehicle')
      return response.status(200).json(theGps)
    } else {
      const dataGps = request.all()
      if ('page' in dataGps && 'per_page' in dataGps) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const gpsList = await Gps.query().preload('vehicle').paginate(page, perPage)
        return response.status(200).json(gpsList)
      }

      const allGps = await Gps.query().preload('vehicle')
      return response.status(200).json(allGps)
    }
  }

  /**
   * Crear un nuevo GPS.
   */
  public async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(createGpsValidator)
    const theGps: Gps = await Gps.create(data)
    await theGps.load('vehicle')
    return response.status(201).json(theGps)
  }

  /**
   * Actualizar un GPS existente.
   */
  public async update({ params, request, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const data = await request.validateUsing(updateGpsValidator)
    const theGps: Gps = await Gps.findOrFail(params.id)

    theGps.merge(data)
    await theGps.save()
    await theGps.load('vehicle')

    return response.status(200).json(theGps)
  }

  /**
   * Eliminar un GPS por id.
   */
  public async delete({ params, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const theGps: Gps = await Gps.findOrFail(params.id)
    await theGps.delete()
    return response.status(200).json({ message: 'GPS deleted successfully' })
  }
}
