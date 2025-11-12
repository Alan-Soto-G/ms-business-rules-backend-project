import type { HttpContext } from '@adonisjs/core/http'
import Municipality from '#models/municipality'
import {
  createMunicipalityValidator,
  updateMunicipalityValidator,
  createItineraryValidator,
} from '#validators/municipality'

export default class MunicipalitiesController {
  /**
   * Obtener un municipio individual o una lista paginada.
   */
  public async find({ response, request, params }: HttpContext) {
    if (params.id) {
      const theMunicipality: Municipality = await Municipality.findOrFail(params.id)
      await theMunicipality.load('destinations')
      await theMunicipality.load('origins')
      return response.status(200).json(theMunicipality)
    } else {
      const dataMunicipalities = request.all()
      if ('page' in dataMunicipalities && 'per_page' in dataMunicipalities) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const municipalities = await Municipality.query().paginate(page, perPage)
        return response.status(200).json(municipalities)
      }

      const allMunicipalities = await Municipality.all()
      return response.status(200).json(allMunicipalities)
    }
  }

  /**
   * Crear un nuevo municipio.
   */
  public async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(createMunicipalityValidator)
    const theMunicipality: Municipality = await Municipality.create(data)
    return response.status(201).json(theMunicipality)
  }

  /**
   * Actualizar un municipio existente.
   */
  public async update({ params, request, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const data = await request.validateUsing(updateMunicipalityValidator)
    const theMunicipality: Municipality = await Municipality.findOrFail(params.id)

    theMunicipality.merge(data)
    await theMunicipality.save()

    return response.status(200).json(theMunicipality)
  }

  /**
   * Eliminar un municipio por id.
   */
  public async delete({ params, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const theMunicipality: Municipality = await Municipality.findOrFail(params.id)
    await theMunicipality.delete()
    return response.status(200).json({ message: 'Municipality deleted successfully' })
  }

  /**
   * Agregar un itinerario (conexión entre dos municipios).
   */
  public async addItinerary({ params, request, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing origin municipality id' })
    }

    const data = await request.validateUsing(createItineraryValidator)
    const originMunicipality: Municipality = await Municipality.findOrFail(params.id)

    // Verificar que el municipio de destino existe
    const destinationMunicipality = await Municipality.findOrFail(data.destinationMunicipalityId)

    // Crear la relación en la tabla pivot
    await originMunicipality.related('destinations').attach({
      [destinationMunicipality.id]: {
        distance: data.distance,
        estimated_time: data.estimatedTime,
      },
    })

    await originMunicipality.load('destinations')
    return response.status(201).json(originMunicipality)
  }

  /**
   * Eliminar un itinerario (conexión entre dos municipios).
   */
  public async removeItinerary({ params, response }: HttpContext) {
    if (!params.id || !params.destinationId) {
      return response.status(400).json({ message: 'Missing origin or destination municipality id' })
    }

    const originMunicipality: Municipality = await Municipality.findOrFail(params.id)
    await originMunicipality.related('destinations').detach([params.destinationId])

    return response.status(200).json({ message: 'Itinerary removed successfully' })
  }

  /**
   * Obtener todos los destinos de un municipio.
   */
  public async getDestinations({ params, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing municipality id' })
    }

    const theMunicipality: Municipality = await Municipality.findOrFail(params.id)
    await theMunicipality.load('destinations')

    return response.status(200).json(theMunicipality.destinations)
  }

  /**
   * Obtener todos los orígenes de un municipio.
   */
  public async getOrigins({ params, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing municipality id' })
    }

    const theMunicipality: Municipality = await Municipality.findOrFail(params.id)
    await theMunicipality.load('origins')

    return response.status(200).json(theMunicipality.origins)
  }
}
