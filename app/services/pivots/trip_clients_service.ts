import TripClient from '#models/pivots/trip_client'
import Trip from '#models/core/trip'
import Client from '#models/core/client'

// Trip Clients Service
export default class TripClientsService {
  /**
   * Get all trip clients with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = TripClient.query().preload('trip').preload('client')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a trip client by ID
   */
  async findById(id: number) {
    return await TripClient.query().where('id', id).preload('trip').preload('client').firstOrFail()
  }

  /**
   * Create a new trip client
   */
  async create(data: any) {
    return await TripClient.create(data)
  }

  /**
   * Update a trip client
   */
  async update(id: number, data: any) {
    const tripClient = await TripClient.findOrFail(id)
    tripClient.merge(data)
    await tripClient.save()
    return tripClient
  }

  /**
   * Delete a trip client
   */
  async delete(id: number) {
    const tripClient = await TripClient.findOrFail(id)
    await tripClient.delete()
    return tripClient
  }

  // Get all clients for a trip
  async getTripClients(tripId: number) {
    const trip = await Trip.findOrFail(tripId)
    await trip.load('tripClients', (query) => {
      query.preload('client')
    })
    return trip.tripClients
  }

  // Associate a client with a trip
  async addClientToTrip(tripId: number, clientId: number) {
    const trip = await Trip.findOrFail(tripId)
    const client = await Client.findOrFail(clientId)

    // Check if relationship already exists
    const exists = await TripClient.query()
      .where('trip_id', trip.id)
      .where('client_id', client.id)
      .first()

    if (exists) {
      throw new Error('This client is already associated with this trip')
    }

    const tripClient = await TripClient.create({
      tripId: trip.id,
      clientId: client.id,
    })

    await tripClient.load('client')
    return tripClient
  }

  // Remove client association from a trip
  async removeClientFromTrip(tripId: number, clientId: number) {
    const tripClient = await TripClient.query()
      .where('trip_id', tripId)
      .where('client_id', clientId)
      .firstOrFail()

    await tripClient.delete()
    return { message: 'Client removed from trip successfully' }
  }
}
