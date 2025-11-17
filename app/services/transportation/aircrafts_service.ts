import Aircraft from '#models/transportation/aircraft'
import Vehicle from '#models/transportation/vehicle'

// Aircrafts Service
export default class AircraftsService {
  /**
   * Get all aircrafts with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Aircraft.query().preload('vehicle').preload('airline')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get an aircraft by ID
   */
  async findById(id: number) {
    return await Aircraft.query()
      .where('id', id)
      .preload('vehicle')
      .preload('airline')
      .firstOrFail()
  }

  /**
   * Create a new aircraft
   */
  async create(data: any) {
    // Validar si el vehicleId ya existe (un vehículo solo puede ser aeronave una vez)
    if (data.vehicleId) {
      const existingAircraft = await Aircraft.query().where('vehicleId', data.vehicleId).first()
      if (existingAircraft) {
        throw new Error(`El vehículo con ID '${data.vehicleId}' ya está registrado como aeronave`)
      }
    }

    // First create the vehicle with corresponding data
    const vehicleData = {
      licensePlate: data.licensePlate,
      brand: data.brand,
      model: data.model,
      year: data.year,
      color: data.color,
      numberOfSeats: data.numberOfSeats,
      vehicleType: data.vehicleType || 'aircraft',
      status: data.status || 'available',
    }

    const vehicle = await Vehicle.create(vehicleData)

    // Then create the aircraft with vehicleId and specific data
    const aircraftData = {
      vehicleId: vehicle.id,
      airlineId: data.airlineId,
      registrationCountry: data.registrationCountry,
      maxAltitude: data.maxAltitude || null,
    }

    const aircraft = await Aircraft.create(aircraftData)
    await aircraft.load('vehicle')
    await aircraft.load('airline')
    return aircraft
  }

  /**
   * Update an aircraft
   */
  async update(id: number, data: any) {
    const aircraft = await Aircraft.findOrFail(id)
    await aircraft.load('vehicle')

    // Validar si el vehicleId ya existe (excluyendo la aeronave actual)
    if (data.vehicleId) {
      const existingAircraft = await Aircraft.query()
        .where('vehicleId', data.vehicleId)
        .whereNot('id', id)
        .first()
      if (existingAircraft) {
        throw new Error(`El vehículo con ID '${data.vehicleId}' ya está registrado como aeronave`)
      }
    }

    // Update vehicle if there's vehicle data
    const vehicleData: any = {}
    if (data.licensePlate) vehicleData.licensePlate = data.licensePlate
    if (data.brand) vehicleData.brand = data.brand
    if (data.model) vehicleData.model = data.model
    if (data.year) vehicleData.year = data.year
    if (data.color) vehicleData.color = data.color
    if (data.numberOfSeats) vehicleData.numberOfSeats = data.numberOfSeats
    if (data.vehicleType) vehicleData.vehicleType = data.vehicleType
    if (data.status) vehicleData.status = data.status

    if (Object.keys(vehicleData).length > 0) {
      aircraft.vehicle.merge(vehicleData)
      await aircraft.vehicle.save()
    }

    // Update aircraft with specific data
    const aircraftData: any = {}
    if (data.airlineId) aircraftData.airlineId = data.airlineId
    if (data.registrationCountry) aircraftData.registrationCountry = data.registrationCountry
    if (data.maxAltitude !== undefined) aircraftData.maxAltitude = data.maxAltitude

    if (Object.keys(aircraftData).length > 0) {
      aircraft.merge(aircraftData)
      await aircraft.save()
    }

    await aircraft.load('vehicle')
    await aircraft.load('airline')
    return aircraft
  }

  /**
   * Delete an aircraft
   */
  async delete(id: number) {
    const aircraft = await Aircraft.findOrFail(id)
    await aircraft.load('vehicle')

    // Delete vehicle (this will also delete aircraft by CASCADE)
    await aircraft.vehicle.delete()
    return { message: 'Aircraft deleted successfully' }
  }
}
