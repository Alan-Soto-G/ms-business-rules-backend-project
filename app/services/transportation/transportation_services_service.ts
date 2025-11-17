import TransportationService from '#models/transportation/transportation_service'
export default class TransportationServicesService {
  /**
   * Get all transportation services with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = TransportationService.query()
      .preload('journey')
      .preload('vehicle')
      .preload('transportItineraries')
    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }
    return await query
  }
  /**
   * Get a transportation service by ID
   */
  async findById(id: number) {
    return await TransportationService.query()
      .where('id', id)
      .preload('journey')
      .preload('vehicle')
      .preload('transportItineraries')
      .firstOrFail()
  }
  /**
   * Create a new transportation service
   */
  async create(data: any) {
    return await TransportationService.create(data)
  }
  /**
   * Update a transportation service
   */
  async update(id: number, data: any) {
    const transportationService = await TransportationService.findOrFail(id)
    transportationService.merge(data)
    await transportationService.save()
    return transportationService
  }
  /**
   * Delete a transportation service
   */
  async delete(id: number) {
    const transportationService = await TransportationService.findOrFail(id)
    await transportationService.delete()
    return transportationService
  }
}
