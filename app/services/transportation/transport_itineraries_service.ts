import TransportItinerary from '#models/transportation/transport_itinerary'

export default class TransportItinerariesService {
  /**
   * Get all transport itineraries with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = TransportItinerary.query()
      .preload('journey')
      .preload('trip')
      .preload('transportationService')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a transport itinerary by ID
   */
  async findById(id: number) {
    return await TransportItinerary.query()
      .where('id', id)
      .preload('journey')
      .preload('trip')
      .preload('transportationService')
      .firstOrFail()
  }

  /**
   * Create a new transport itinerary
   */
  async create(data: any) {
    return await TransportItinerary.create(data)
  }

  /**
   * Update a transport itinerary
   */
  async update(id: number, data: any) {
    const transportItinerary = await TransportItinerary.findOrFail(id)
    transportItinerary.merge(data)
    await transportItinerary.save()
    return transportItinerary
  }

  /**
   * Delete a transport itinerary
   */
  async delete(id: number) {
    const transportItinerary = await TransportItinerary.findOrFail(id)
    await transportItinerary.delete()
    return transportItinerary
  }
}
