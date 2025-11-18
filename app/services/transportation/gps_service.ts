import Gps from '#models/transportation/gps'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class GpsService {
  /**
   * Get all GPS devices with optional pagination
   */
  async getAllGps(
    page?: number,
    limit?: number
  ): Promise<Gps[] | ModelPaginatorContract<Gps>> {
    const query = Gps.query().preload('vehicle').orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get GPS device by ID
   */
  async getGpsById(id: number): Promise<Gps | null> {
    return await Gps.query().where('id', id).preload('vehicle').first()
  }

  /**
   * Create new GPS device
   */
  async createGps(data: {
    vehicleId: number
    serialNumber: string
    brand: string
    model: string
    isActive?: boolean
  }): Promise<Gps> {
    const gps = await Gps.create(data)
    await gps.load('vehicle')
    return gps
  }

  /**
   * Update GPS device
   */
  async updateGps(
    id: number,
    data: {
      vehicleId?: number
      serialNumber?: string
      brand?: string
      model?: string
      isActive?: boolean
    }
  ): Promise<Gps | null> {
    const gps = await Gps.find(id)

    if (!gps) {
      return null
    }

    gps.merge(data)
    await gps.save()

    await gps.load('vehicle')
    return gps
  }

  /**
   * Delete GPS device
   */
  async deleteGps(id: number): Promise<boolean> {
    const gps = await Gps.find(id)

    if (!gps) {
      return false
    }

    await gps.delete()
    return true
  }
}
