import Car from '#models/transportation/car'

// Cars Service
export default class CarsService {
  /**
   * Get all cars with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Car.query().preload('vehicle').preload('hotel')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a car by ID
   */
  async findById(id: number) {
    return await Car.query().where('id', id).preload('vehicle').preload('hotel').firstOrFail()
  }

  /**
   * Create a new car
   */
  async create(data: any) {
    return await Car.create(data)
  }

  /**
   * Update a car
   */
  async update(id: number, data: any) {
    const car = await Car.findOrFail(id)
    car.merge(data)
    await car.save()
    return car
  }

  /**
   * Delete a car
   */
  async delete(id: number) {
    const car = await Car.findOrFail(id)
    await car.delete()
    return car
  }
}
