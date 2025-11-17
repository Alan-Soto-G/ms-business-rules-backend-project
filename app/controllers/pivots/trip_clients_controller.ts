import type { HttpContext } from '@adonisjs/core/http'
import TripClientsService from '#services/pivots/trip_clients_service'

export default class TripClientsController {
  private tripClientsService: TripClientsService

  constructor() {
    this.tripClientsService = new TripClientsService()
  }

  // Obtener todos los clientes de un viaje
  public async index({ params, response }: HttpContext) {
    try {
      const tripClients = await this.tripClientsService.getTripClients(params.tripId)
      return response.status(200).json(tripClients)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  // Asociar un cliente a un viaje
  public async store({ params, response }: HttpContext) {
    try {
      const tripClient = await this.tripClientsService.addClientToTrip(
        params.tripId,
        params.clientId
      )
      return response.status(201).json(tripClient)
    } catch (error) {
      if (error.message.includes('already associated')) {
        return response.status(409).json({ message: error.message })
      }
      return response.status(404).json({ message: error.message })
    }
  }

  // Eliminar la asociación de un cliente con un viaje
  public async destroy({ params, response }: HttpContext) {
    try {
      const result = await this.tripClientsService.removeClientFromTrip(
        params.tripId,
        params.clientId
      )
      return response.status(200).json(result)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
