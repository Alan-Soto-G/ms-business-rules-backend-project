import Journey from '#models/transportation/journey'
export default class JourneysService {
  /**
   * Get all journeys with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Journey.query()
      .preload('originMunicipality')
      .preload('destinationMunicipality')
      .preload('transportationServices')
    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }
    return await query
  }
  /**
   * Get a journey by ID
   */
  async findById(id: number) {
    return await Journey.query()
      .where('id', id)
      .preload('originMunicipality')
      .preload('destinationMunicipality')
      .preload('transportationServices')
      .firstOrFail()
  }
  /**
   * Create a new journey
   */
  async create(data: any) {
    return await Journey.create(data)
  }
  /**
   * Update a journey
   */
  async update(id: number, data: any) {
    const journey = await Journey.findOrFail(id)
    journey.merge(data)
    await journey.save()
    return journey
  }
  /**
   * Delete a journey
   */
  async delete(id: number) {
    const journey = await Journey.findOrFail(id)
    await journey.delete()
    return journey
  }
}
