import type { HttpContext } from '@adonisjs/core/http'
import Airline from '#models/airline'
import { createAirlineValidator, updateAirlineValidator } from '#validators/airline'

/**
 * Controlador de Airlines (Aerolíneas)
 */
export default class AirlinesController {
  /**
   * Obtener una aerolínea individual o una lista paginada.
   */
  public async find({ response, request, params }: HttpContext) {
    if (params.id) {
      const theAirline: Airline = await Airline.findOrFail(params.id)
      await theAirline.load('aircrafts', (query) => {
        query.preload('vehicle')
      })
      return response.status(200).json(theAirline)
    } else {
      const dataAirlines = request.all()
      if ('page' in dataAirlines && 'per_page' in dataAirlines) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const airlines = await Airline.query().paginate(page, perPage)
        return response.status(200).json(airlines)
      }

      const allAirlines = await Airline.all()
      return response.status(200).json(allAirlines)
    }
  }

  /**
   * Crear una nueva aerolínea.
   */
  public async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(createAirlineValidator)
    const theAirline: Airline = await Airline.create(data)
    return response.status(201).json(theAirline)
  }

  /**
   * Actualizar una aerolínea existente.
   */
  public async update({ params, request, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const data = await request.validateUsing(updateAirlineValidator)
    const theAirline: Airline = await Airline.findOrFail(params.id)

    theAirline.merge(data)
    await theAirline.save()

    return response.status(200).json(theAirline)
  }

  /**
   * Eliminar una aerolínea por id.
   */
  public async delete({ params, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const theAirline: Airline = await Airline.findOrFail(params.id)
    await theAirline.delete()
    return response.status(200).json({ message: 'Airline deleted successfully' })
  }
}
