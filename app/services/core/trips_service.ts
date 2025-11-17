import Trip from '#models/core/trip'

export default class TripsService {
  /**
   * Get all trips
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Trip.query()
      .preload('fees')
      .preload('tripClients')
      .preload('tripPlans')
      .preload('Bookings')
      .preload('transportItineraries')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a trip by ID
   */
  async findById(id: number) {
    return await Trip.query()
      .where('id', id)
      .preload('fees')
      .preload('tripClients')
      .preload('tripPlans')
      .preload('Bookings')
      .preload('transportItineraries')
      .firstOrFail()
  }

  /**
   * Create a new trip
   */
  async create(data: any) {
    return await Trip.create(data)
  }

  /**
   * Update a trip
   */
  async update(id: number, data: any) {
    const trip = await Trip.findOrFail(id)
    trip.merge(data)
    await trip.save()
    return trip
  }

  /**
   * Delete a trip
   */
  async delete(id: number) {
    const trip = await Trip.findOrFail(id)
    await trip.delete()
    return trip
  }
}
