import type { HttpContext } from '@adonisjs/core/http'
import Airline from '#models/airline'

/**
 * Controlador de Airlines (Aerolíneas)
 *
 * Contiene los métodos CRUD básicos expuestos por la API:
 * - find: obtener una o varias aerolíneas (con paginación opcional)
 * - create: crear una nueva aerolínea
 * - update: actualizar campos permitidos de una aerolínea existente
 * - delete: eliminar una aerolínea
 */
export default class AirlinesController {
  /**
   * Obtener una aerolínea individual o una lista paginada.
   *
   * Comportamiento:
   * - Si `params.id` está presente, busca la aerolínea por id y la devuelve.
   * - Si no hay `params.id`, comprueba si la request contiene `page` y `per_page` y
   *   devuelve una respuesta paginada.
   *
   * @param {HttpContext} ctx - Contexto HTTP (request, response, params)
   * @returns {Promise<any>} Respuesta HTTP con la aerolínea o la página de resultados
   */
  public async find({ response, request, params }: HttpContext) {
    if (params.id) {
      const theAirline: Airline = await Airline.findOrFail(params.id)
      return response.status(200).json(theAirline)
    } else {
      const dataAirlines = request.all()
      if ('page' in dataAirlines && 'per_page' in dataAirlines) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const airlines = await Airline.query().paginate(page, perPage)
        return response.status(200).json(airlines)
      }

      // Si no se proporciona id ni parámetros de paginación, devolver todas las aerolíneas.
      // Esto evita que el método termine sin retornar nada y proporciona una respuesta útil
      // por defecto (200 con la lista completa). Si la lista es muy grande, se recomienda
      // usar paginación en el cliente o limitar el número de resultados aquí.
      const allAirlines = await Airline.all()
      return response.status(200).json(allAirlines)
    }
  }

  /**
   * Crear una nueva aerolínea.
   *
   * @param {HttpContext} ctx - Contexto HTTP (request, response)
   * @returns {Promise<any>} 201 con la aerolínea creada o 500 en error interno
   */
  public async create({ request, response }: HttpContext) {
    const body = request.body()
    const theAirline: Airline = await Airline.create(body)
    if (!theAirline) {
      return response.status(500).json({ message: 'Error creating airline' })
    }
    return response.status(201).json(theAirline)
  }

  /**
   * Actualizar una aerolínea existente.
   *
   * Flujo:
   * - Requiere `params.id`; si no está, responde 400.
   * - Busca la aerolínea con `findOrFail` (lanzará 404 si no existe).
   * - Solo permite actualizar un conjunto explícito de campos (guardado en `updates`).
   * - Usa `merge(updates)` para aplicar los cambios y luego `save()` para persistir.
   *
   * @param {HttpContext} ctx - Contexto HTTP (params, request, response)
   * @returns {Promise<any>} 200 con la aerolínea actualizada o 400 si falta id
   */
  public async update({ params, request, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const theAirline: Airline = await Airline.findOrFail(params.id)

    // Solo permitir actualizar campos específicos
    const updates = request.only([
      'name',
      'codeIata',
      'codeIcao',
      'countryOfOrigin',
      'foundingYear',
      'isActive',
      'address',
      'phone',
      'email',
      'website',
      'headquarterCity',
      'ceo',
      'aircraftCount',
      'aircraftModels',
      'numberDestinations',
      'mainHubs',
      'alliance',
      'frequentFlyerProgram',
      'onTimePerformance',
      'serviceRating',
    ])

    theAirline.merge(updates)
    await theAirline.save()

    return response.status(200).json(theAirline)
  }

  /**
   * Eliminar una aerolínea por id.
   *
   * @param {HttpContext} ctx - Contexto HTTP (params, response)
   * @returns {Promise<any>} 200 con mensaje de éxito o 400 si falta id
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
