import Gps from '#models/transportation/gps'

export default class GpsService {
  /**
   * Get all GPS devices with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Gps.query().preload('vehicle')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a GPS device by ID
   */
  async findById(id: number) {
    return await Gps.query().where('id', id).preload('vehicle').firstOrFail()
  }

  /**
   * Create a new GPS device
   */
  async create(data: any) {
    return await Gps.create(data)
  }

  /**
   * Update a GPS device
   */
  async update(id: number, data: any) {
    const gps = await Gps.findOrFail(id)
    gps.merge(data)
    await gps.save()
    return gps
  }

  /**
   * Delete a GPS device
   */
  async delete(id: number) {
    const gps = await Gps.findOrFail(id)
    await gps.delete()
    return gps
  }
}
