import Airline from '#models/transportation/airline'

export default class AirlinesService {
  /**
   * Get all airlines with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Airline.query().preload('aircraft')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get an airline by ID
   */
  async findById(id: number) {
    return await Airline.query().where('id', id).preload('aircraft').firstOrFail()
  }

  /**
   * Create a new airline
   */
  async create(data: any) {
    return await Airline.create(data)
  }

  /**
   * Update an airline
   */
  async update(id: number, data: any) {
    const airline = await Airline.findOrFail(id)
    airline.merge(data)
    await airline.save()
    return airline
  }

  /**
   * Delete an airline
   */
  async delete(id: number) {
    const airline = await Airline.findOrFail(id)
    await airline.delete()
    return airline
  }
}
