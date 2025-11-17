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
    // Validar si el vehicleId ya existe (un vehículo solo puede ser carro una vez)
    if (data.vehicleId) {
      const existingCar = await Car.query().where('vehicleId', data.vehicleId).first()
      if (existingCar) {
        throw new Error(`El vehículo con ID '${data.vehicleId}' ya está registrado como carro`)
      }
    }

    return await Car.create(data)
  }

  /**
   * Update a car
   */
  async update(id: number, data: any) {
    const car = await Car.findOrFail(id)

    // Validar si el vehicleId ya existe (excluyendo el carro actual)
    if (data.vehicleId) {
      const existingCar = await Car.query()
        .where('vehicleId', data.vehicleId)
        .whereNot('id', id)
        .first()
      if (existingCar) {
        throw new Error(`El vehículo con ID '${data.vehicleId}' ya está registrado como carro`)
      }
    }

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
