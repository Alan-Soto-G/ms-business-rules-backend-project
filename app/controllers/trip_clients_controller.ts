import type { HttpContext } from '@adonisjs/core/http'
import TripClient from '#models/trip_client'
import Trip from '#models/trip'
import Client from '#models/client'

export default class TripClientsController {
  // Obtener todos los clientes de un viaje
  public async index({ params, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.tripId)
    await trip.load('tripClients', (query) => {
      query.preload('client')
    })
    return response.status(200).json(trip.tripClients)
  }

  // Asociar un cliente a un viaje
  public async store({ params, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.tripId)
    const client = await Client.findOrFail(params.clientId)

    // Verificar si ya existe la relación
    const exists = await TripClient.query()
      .where('trip_id', trip.id)
      .where('client_id', client.id)
      .first()

    if (exists) {
      return response
        .status(409)
        .json({ message: 'This client is already associated with this trip' })
    }

    const tripClient = await TripClient.create({
      tripId: trip.id,
      clientId: client.id,
    })

    await tripClient.load('client')
    return response.status(201).json(tripClient)
  }

  // Eliminar la asociación de un cliente con un viaje
  public async destroy({ params, response }: HttpContext) {
    const tripClient = await TripClient.query()
      .where('trip_id', params.tripId)
      .where('client_id', params.clientId)
      .firstOrFail()

    await tripClient.delete()
    return response.status(200).json({ message: 'Client removed from trip successfully' })
  }
}
