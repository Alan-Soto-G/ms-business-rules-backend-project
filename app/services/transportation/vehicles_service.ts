import Vehicle from '#models/transportation/vehicle'

export default class VehiclesService {
  /**
   * Get all vehicles
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Vehicle.query()
      .preload('aircraft')
      .preload('gps')
      .preload('car')
      .preload('transportationServices')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a vehicle by ID
   */
  async findById(id: number) {
    return await Vehicle.query()
      .where('id', id)
      .preload('aircraft')
      .preload('gps')
      .preload('car')
      .preload('transportationServices')
      .firstOrFail()
  }

  /**
   * Create a new vehicle
   */
  async create(data: any) {
    return await Vehicle.create(data)
  }

  /**
   * Update a vehicle
   */
  async update(id: number, data: any) {
    const vehicle = await Vehicle.findOrFail(id)
    vehicle.merge(data)
    await vehicle.save()
    return vehicle
  }

  /**
   * Delete a vehicle
   */
  async delete(id: number) {
    const vehicle = await Vehicle.findOrFail(id)
    await vehicle.delete()
    return vehicle
  }
}
