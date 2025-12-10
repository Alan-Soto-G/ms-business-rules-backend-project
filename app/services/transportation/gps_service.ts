import Gps from '#models/transportation/gps'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'
import transmit from '@adonisjs/transmit/services/main'

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
   * Get GPS device by Vehicle ID
   */
  async getGpsByVehicleId(vehicleId: number): Promise<Gps | null> {
    return await Gps.query().where('vehicle_id', vehicleId).preload('vehicle').first()
  }

  /**
   * Get current location of a vehicle
   */
  async getCurrentLocation(vehicleId: number): Promise<{
    latitude: number | null
    longitude: number | null
    speed: number | null
    lastUpdate: DateTime | null
    connectionStatus: string
  } | null> {
    const gps = await this.getGpsByVehicleId(vehicleId)

    if (!gps) {
      return null
    }

    return {
      latitude: gps.latitude,
      longitude: gps.longitude,
      speed: gps.speed,
      lastUpdate: gps.lastLocationUpdate,
      connectionStatus: gps.connectionStatus,
    }
  }

  /**
   * Update GPS location (for tracking)
   */
  async updateLocation(
    vehicleId: number,
    data: {
      latitude: number
      longitude: number
      speed?: number
    }
  ): Promise<Gps | null> {
    const gps = await this.getGpsByVehicleId(vehicleId)

    if (!gps) {
      return null
    }

    // Update location data
    gps.latitude = data.latitude
    gps.longitude = data.longitude
    gps.speed = data.speed || null
    gps.lastLocationUpdate = DateTime.now()
    gps.connectionStatus = 'online'

    await gps.save()
    await gps.load('vehicle')

    // Emit real-time update via WebSocket
    transmit.broadcast(`gps/vehicle/${vehicleId}`, {
      vehicleId: vehicleId,
      latitude: gps.latitude,
      longitude: gps.longitude,
      speed: gps.speed,
      timestamp: gps.lastLocationUpdate.toISO(),
      connectionStatus: gps.connectionStatus,
    })

    return gps
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
    const gps = await Gps.create({
      ...data,
      connectionStatus: 'offline',
    })
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

  /**
   * Mark GPS as offline
   */
  async markAsOffline(vehicleId: number): Promise<void> {
    const gps = await this.getGpsByVehicleId(vehicleId)

    if (gps) {
      gps.connectionStatus = 'offline'
      await gps.save()

      // Notify via WebSocket
      transmit.broadcast(`gps/vehicle/${vehicleId}`, {
        vehicleId: vehicleId,
        connectionStatus: 'offline',
        timestamp: DateTime.now().toISO(),
      })
    }
  }
}