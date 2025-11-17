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
    // Validar si el serialNumber ya existe antes de intentar crear
    if (data.serialNumber) {
      const existingBySerial = await Gps.query()
        .where('serialNumber', data.serialNumber)
        .first()
      if (existingBySerial) {
        throw new Error(`El número de serie '${data.serialNumber}' ya está en uso por otro GPS`)
      }
    }

    // Validar si el vehicleId ya existe (un vehículo solo puede tener un GPS)
    if (data.vehicleId) {
      const existingByVehicle = await Gps.query()
        .where('vehicleId', data.vehicleId)
        .first()
      if (existingByVehicle) {
        throw new Error(`El vehículo con ID '${data.vehicleId}' ya tiene un GPS asignado`)
      }
    }

    return await Gps.create(data)
  }

  /**
   * Update a GPS device
   */
  async update(id: number, data: any) {
    const gps = await Gps.findOrFail(id)

    // Validar si el serialNumber ya existe (excluyendo el GPS actual)
    if (data.serialNumber) {
      const existingBySerial = await Gps.query()
        .where('serialNumber', data.serialNumber)
        .whereNot('id', id)
        .first()
      if (existingBySerial) {
        throw new Error(`El número de serie '${data.serialNumber}' ya está en uso por otro GPS`)
      }
    }

    // Validar si el vehicleId ya existe (excluyendo el GPS actual)
    if (data.vehicleId) {
      const existingByVehicle = await Gps.query()
        .where('vehicleId', data.vehicleId)
        .whereNot('id', id)
        .first()
      if (existingByVehicle) {
        throw new Error(`El vehículo con ID '${data.vehicleId}' ya tiene un GPS asignado`)
      }
    }

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
