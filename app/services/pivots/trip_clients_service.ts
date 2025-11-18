import TripClient from '#models/pivots/trip_client'
import Trip from '#models/core/trip'
import Client from '#models/core/client'

export default class TripClientsService {
  /**
   * Get all trip clients with optional pagination
   */
  async getAllTripClients(page?: number, limit?: number) {
    if (page && limit) {
      return await TripClient.query().preload('trip').preload('client').paginate(page, limit)
    }

    return await TripClient.query().preload('trip').preload('client')
  }

  /**
   * Get trip client by ID
   */
  async getTripClientById(id: number) {
    return await TripClient.query().where('id', id).preload('trip').preload('client').first()
  }

  /**
   * Get all clients by trip
   */
  async getClientsByTrip(tripId: number) {
    return await TripClient.query().where('trip_id', tripId).preload('trip').preload('client')
  }

  /**
   * Get all trips by client
   */
  async getTripsByClient(clientId: number) {
    return await TripClient.query().where('client_id', clientId).preload('trip').preload('client')
  }

  /**
   * Create a new trip client
   * A) Validates existence of Trip and Client
   * B) Prevents duplicates
   * C) Inserts cleanly into pivot table
   */
  async createTripClient(data: { trip_id: number; client_id: number }) {
    // A) Validate existence of Trip
    const trip = await Trip.find(data.trip_id)
    if (!trip) {
      throw new Error(`Trip with ID ${data.trip_id} does not exist`)
    }

    // A) Validate existence of Client
    const client = await Client.find(data.client_id)
    if (!client) {
      throw new Error(`Client with ID ${data.client_id} does not exist`)
    }

    // B) Check for duplicate assignment
    const existingAssignment = await TripClient.query()
      .where('trip_id', data.trip_id)
      .where('client_id', data.client_id)
      .first()

    if (existingAssignment) {
      throw new Error(`Client ${data.client_id} is already assigned to trip ${data.trip_id}`)
    }

    // C) Insert cleanly into pivot table
    const tripClient = await TripClient.create({
      tripId: data.trip_id,
      clientId: data.client_id,
    })

    await tripClient.load('trip')
    await tripClient.load('client')

    return tripClient
  }

  /**
   * Assign a client to a trip
   * D) Allows multiple assignments (multiple clients per trip or multiple trips per client)
   */
  async assignTripClient(data: { trip_id: number; client_id: number }) {
    // Reuse the same logic as create (validates, prevents duplicates, inserts cleanly)
    return await this.createTripClient(data)
  }

  /**
   * Unassign a client from a trip
   */
  async unassignTripClient(tripId: number, clientId: number) {
    const tripClient = await TripClient.query()
      .where('trip_id', tripId)
      .where('client_id', clientId)
      .first()

    if (!tripClient) {
      return false
    }

    await tripClient.delete()
    return true
  }

  /**
   * Update a trip client
   */
  async updateTripClient(
    id: number,
    data: {
      trip_id?: number
      client_id?: number
    }
  ) {
    const tripClient = await TripClient.find(id)

    if (!tripClient) {
      return null
    }

    // Validate new trip_id if provided
    if (data.trip_id && data.trip_id !== tripClient.tripId) {
      const trip = await Trip.find(data.trip_id)
      if (!trip) {
        throw new Error(`Trip with ID ${data.trip_id} does not exist`)
      }

      // Check for duplicate with new trip_id
      const existingAssignment = await TripClient.query()
        .where('trip_id', data.trip_id)
        .where('client_id', data.client_id || tripClient.clientId)
        .whereNot('id', id)
        .first()

      if (existingAssignment) {
        throw new Error(
          `Client ${data.client_id || tripClient.clientId} is already assigned to trip ${data.trip_id}`
        )
      }
    }

    // Validate new client_id if provided
    if (data.client_id && data.client_id !== tripClient.clientId) {
      const client = await Client.find(data.client_id)
      if (!client) {
        throw new Error(`Client with ID ${data.client_id} does not exist`)
      }

      // Check for duplicate with new client_id
      const existingAssignment = await TripClient.query()
        .where('trip_id', data.trip_id || tripClient.tripId)
        .where('client_id', data.client_id)
        .whereNot('id', id)
        .first()

      if (existingAssignment) {
        throw new Error(
          `Client ${data.client_id} is already assigned to trip ${data.trip_id || tripClient.tripId}`
        )
      }
    }

    // Update fields
    if (data.trip_id) tripClient.tripId = data.trip_id
    if (data.client_id) tripClient.clientId = data.client_id

    await tripClient.save()
    await tripClient.load('trip')
    await tripClient.load('client')

    return tripClient
  }

  /**
   * Delete a trip client
   */
  async deleteTripClient(id: number) {
    const tripClient = await TripClient.find(id)

    if (!tripClient) {
      return false
    }

    await tripClient.delete()
    return true
  }
}
