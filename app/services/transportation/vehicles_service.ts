import Vehicle from '#models/transportation/vehicle'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class VehiclesService {
  /**
   * Get all vehicles with optional pagination
   */
  async getAllVehicles(
    page?: number,
    limit?: number
  ): Promise<Vehicle[] | ModelPaginatorContract<Vehicle>> {
    const query = Vehicle.query().orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get vehicle by ID
   */
  async getVehicleById(id: number): Promise<Vehicle | null> {
    return await Vehicle.query().where('id', id).first()
  }

  /**
   * Create new vehicle
   */
  async createVehicle(data: {
    licensePlate: string
    brand: string
    model: string
    year: number
    color: string
    numberOfSeats: number
    vehicleType: string
    status?: 'available' | 'in_use' | 'maintenance' | 'retired'
  }): Promise<Vehicle> {
    return await Vehicle.create(data)
  }

  /**
   * Update vehicle
   */
  async updateVehicle(
    id: number,
    data: {
      licensePlate?: string
      brand?: string
      model?: string
      year?: number
      color?: string
      numberOfSeats?: number
      vehicleType?: string
      status?: 'available' | 'in_use' | 'maintenance' | 'retired'
    }
  ): Promise<Vehicle | null> {
    const vehicle = await Vehicle.find(id)

    if (!vehicle) {
      return null
    }

    vehicle.merge(data)
    await vehicle.save()

    return vehicle
  }

  /**
   * Delete vehicle
   */
  async deleteVehicle(id: number): Promise<boolean> {
    const vehicle = await Vehicle.find(id)

    if (!vehicle) {
      return false
    }

    await vehicle.delete()
    return true
  }
}
