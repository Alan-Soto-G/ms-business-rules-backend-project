import TripClient from '#models/pivots/trip_client'
import Trip from '#models/core/trip'
import Client from '#models/core/client'

export default class TripClientsService {
  /**
   * Get all trip clients with optional pagination
   */
  async getAllTripClients(page?: number, limit?: number) {
    if (page && limit) {
      return await TripClient.query()
        .preload('trip')
        .preload('client')
        .preload('fees')
        .paginate(page, limit)
    }

    return await TripClient.query()
      .preload('trip')
      .preload('client')
      .preload('fees')
  }

  /**
   * Get trip client by ID
   */
  async getTripClientById(id: number) {
    return await TripClient.query()
      .where('id', id)
      .preload('trip')
      .preload('client')
      .preload('fees')
      .first()
  }

  /**
   * Get orders for a specific client (user)
   */
  async getOrdersByClient(clientId: number) {
    return await TripClient.query()
      .where('client_id', clientId)
      .preload('trip')
      .preload('client')
      .preload('fees')
      .orderBy('created_at', 'desc')
  }

  /**
   * Get all clients by trip
   */
  async getClientsByTrip(tripId: number) {
    return await TripClient.query()
      .where('trip_id', tripId)
      .preload('trip')
      .preload('client')
      .preload('fees')
  }

  /**
   * Get all trips by client
   */
  async getTripsByClient(clientId: number) {
    return await TripClient.query()
      .where('client_id', clientId)
      .preload('trip')
      .preload('client')
      .preload('fees')
  }

  /**
   * Create a new trip client
   * A) Validates existence of Trip and Client
   * B) Prevents duplicates
   * C) Inserts cleanly into pivot table
   */
  async createTripClient(data: Partial<TripClient>) {
    // A) Validate existence of Trip
    const trip = await Trip.find(data.tripId)
    if (!trip) {
      throw new Error(`Trip with ID ${data.tripId} does not exist`)
    }

    // A) Validate existence of Client
    const client = await Client.find(data.clientId)
    if (!client) {
      throw new Error(`Client with ID ${data.clientId} does not exist`)
    }

    // B) Check for duplicate assignment
    const existingAssignment = await TripClient.query()
      .where('trip_id', data.tripId!)
      .where('client_id', data.clientId!)
      .first()

    if (existingAssignment) {
      throw new Error(`Client ${data.clientId} is already assigned to trip ${data.tripId}`)
    }

    // C) Insert cleanly into pivot table
    const tripClient = await TripClient.create({
      tripId: data.tripId!,
      clientId: data.clientId!,
      travelers: data.travelers || 1,
      quantity: data.quantity || 1,
      installments: data.installments || 1,
      totalAmount: data.totalAmount!,
      totalWithInterest: data.totalWithInterest || data.totalAmount!,
      interestRate: data.interestRate || 0,
      paymentStatus: data.paymentStatus || 'pending',
      epaycoRef: data.epaycoRef || null,
    })

    await tripClient.load('trip')
    await tripClient.load('client')
    await tripClient.load('fees')

    return tripClient
  }

  /**
   * Assign a client to a trip
   * D) Allows multiple assignments (multiple clients per trip or multiple trips per client)
   */
  async assignTripClient(data: Partial<TripClient>) {
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
  async updateTripClient(id: number, data: Partial<TripClient>) {
    const tripClient = await TripClient.find(id)

    if (!tripClient) {
      return null
    }

    // Validate new tripId if provided
    if (data.tripId && data.tripId !== tripClient.tripId) {
      const trip = await Trip.find(data.tripId)
      if (!trip) {
        throw new Error(`Trip with ID ${data.tripId} does not exist`)
      }

      // Check for duplicate with new tripId
      const existingAssignment = await TripClient.query()
        .where('trip_id', data.tripId)
        .where('client_id', data.clientId || tripClient.clientId)
        .whereNot('id', id)
        .first()

      if (existingAssignment) {
        throw new Error(
          `Client ${data.clientId || tripClient.clientId} is already assigned to trip ${data.tripId}`
        )
      }
    }

    // Validate new clientId if provided
    if (data.clientId && data.clientId !== tripClient.clientId) {
      const client = await Client.find(data.clientId)
      if (!client) {
        throw new Error(`Client with ID ${data.clientId} does not exist`)
      }

      // Check for duplicate with new clientId
      const existingAssignment = await TripClient.query()
        .where('trip_id', data.tripId || tripClient.tripId)
        .where('client_id', data.clientId)
        .whereNot('id', id)
        .first()

      if (existingAssignment) {
        throw new Error(
          `Client ${data.clientId} is already assigned to trip ${data.tripId || tripClient.tripId}`
        )
      }
    }

    // Update fields
    if (data.tripId !== undefined) tripClient.tripId = data.tripId
    if (data.clientId !== undefined) tripClient.clientId = data.clientId
    if (data.travelers !== undefined) tripClient.travelers = data.travelers
    if (data.quantity !== undefined) tripClient.quantity = data.quantity
    if (data.installments !== undefined) tripClient.installments = data.installments
    if (data.totalAmount !== undefined) tripClient.totalAmount = data.totalAmount
    if (data.totalWithInterest !== undefined) tripClient.totalWithInterest = data.totalWithInterest
    if (data.interestRate !== undefined) tripClient.interestRate = data.interestRate
    if (data.paymentStatus !== undefined) tripClient.paymentStatus = data.paymentStatus
    if (data.epaycoRef !== undefined) tripClient.epaycoRef = data.epaycoRef

    await tripClient.save()
    await tripClient.load('trip')
    await tripClient.load('client')
    await tripClient.load('fees')

    return tripClient
  }

  /**
   * Delete a trip client
   */
async deleteTripClient(id: number) {
  // 1. Buscar la orden
  const tripClient = await TripClient.query()
    .where('id', id)
    .preload('fees')
    .first()

  // 2. ¿Existe?
  if (!tripClient) {
    return { success: false, error: 'not_found' }
  }

  // 3. ¿Ya se pagó algo?
  const yaSePago = tripClient.paymentStatus !== 'pending'
  
  if (yaSePago) {
    return { 
      success: false, 
      error: 'payment_exists',
      message: 'No se puede eliminar una orden que ya tiene pagos'
    }
  }

  // 4. ¿Tiene cuotas creadas? (seguridad extra)
  const tieneCuotas = tripClient.fees && tripClient.fees.length > 0
  
  if (tieneCuotas) {
    return { 
      success: false, 
      error: 'payment_exists',
      message: 'No se puede eliminar una orden con cuotas registradas'
    }
  }

  // 5. Todo OK, eliminar
  await tripClient.delete()
  return { success: true }
}

}