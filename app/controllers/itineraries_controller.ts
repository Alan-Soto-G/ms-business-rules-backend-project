import type { HttpContext } from '@adonisjs/core/http'
import Itinerary from '#models/itinerary'
import { createItineraryValidator, updateItineraryValidator } from '#validators/itinerary'

export default class ItinerariesController {
  /**
   * Obtener un itinerario individual o una lista paginada.
   */
  public async find({ response, request, params }: HttpContext) {
    if (params.id) {
      const theItinerary: Itinerary = await Itinerary.findOrFail(params.id)
      await theItinerary.load('originMunicipality')
      await theItinerary.load('destinationMunicipality')
      return response.status(200).json(theItinerary)
    } else {
      const dataItineraries = request.all()
      if ('page' in dataItineraries && 'per_page' in dataItineraries) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const itineraries = await Itinerary.query()
          .preload('originMunicipality')
          .preload('destinationMunicipality')
          .paginate(page, perPage)
        return response.status(200).json(itineraries)
      }

      const allItineraries = await Itinerary.query()
        .preload('originMunicipality')
        .preload('destinationMunicipality')
      return response.status(200).json(allItineraries)
    }
  }

  /**
   * Crear un nuevo itinerario.
   */
  public async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(createItineraryValidator)

    // Verificar que no sea el mismo municipio
    if (data.originMunicipalityId === data.destinationMunicipalityId) {
      return response
        .status(400)
        .json({ message: 'Origin and destination cannot be the same municipality' })
    }

    const theItinerary: Itinerary = await Itinerary.create(data)
    await theItinerary.load('originMunicipality')
    await theItinerary.load('destinationMunicipality')
    return response.status(201).json(theItinerary)
  }

  /**
   * Actualizar un itinerario existente.
   */
  public async update({ params, request, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const data = await request.validateUsing(updateItineraryValidator)
    const theItinerary: Itinerary = await Itinerary.findOrFail(params.id)

    theItinerary.merge(data)
    await theItinerary.save()
    await theItinerary.load('originMunicipality')
    await theItinerary.load('destinationMunicipality')

    return response.status(200).json(theItinerary)
  }

  /**
   * Eliminar un itinerario por id.
   */
  public async delete({ params, response }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Missing id parameter' })
    }

    const theItinerary: Itinerary = await Itinerary.findOrFail(params.id)
    await theItinerary.delete()
    return response.status(200).json({ message: 'Itinerary deleted successfully' })
  }

  /**
   * Obtener itinerarios por municipio de origen.
   */
  public async findByOrigin({ params, response }: HttpContext) {
    if (!params.municipalityId) {
      return response.status(400).json({ message: 'Missing municipality id' })
    }

    const itineraries = await Itinerary.query()
      .where('origin_municipality_id', params.municipalityId)
      .preload('destinationMunicipality')

    return response.status(200).json(itineraries)
  }

  /**
   * Obtener itinerarios por municipio de destino.
   */
  public async findByDestination({ params, response }: HttpContext) {
    if (!params.municipalityId) {
      return response.status(400).json({ message: 'Missing municipality id' })
    }

    const itineraries = await Itinerary.query()
      .where('destination_municipality_id', params.municipalityId)
      .preload('originMunicipality')

    return response.status(200).json(itineraries)
  }
}
