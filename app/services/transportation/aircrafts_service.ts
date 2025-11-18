import Aircraft from '#models/transportation/aircraft'
import Vehicle from '#models/transportation/vehicle'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import db from '@adonisjs/lucid/services/db'

export default class AircraftsService {
  /**
   * Get all aircrafts with optional pagination
   */
  async getAllAircrafts(
    page?: number,
    limit?: number
  ): Promise<Aircraft[] | ModelPaginatorContract<Aircraft>> {
    const query = Aircraft.query().preload('vehicle').preload('airline').orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get aircraft by ID
   */
  async getAircraftById(id: number): Promise<Aircraft | null> {
    return await Aircraft.query().where('id', id).preload('vehicle').preload('airline').first()
  }

  /**
   * Create new aircraft
   * Supports two scenarios:
   * A) vehicleId provided: associate with existing vehicle
   * B) vehicleId not provided: create new vehicle first
   */
  async createAircraft(data: {
    vehicleId?: number
    licensePlate?: string
    brand?: string
    model?: string
    year?: number
    color?: string
    numberOfSeats?: number
    vehicleType?: string
    status?: 'available' | 'in_use' | 'maintenance' | 'retired'
    airlineId: number
    registrationCountry: string
    maxAltitude?: number
  }): Promise<Aircraft> {
    const trx = await db.transaction()

    try {
      let vehicleId = data.vehicleId

      // Scenario B: Create new vehicle if vehicleId not provided
      if (!vehicleId) {
        // Validate required fields for creating vehicle
        if (
          !data.licensePlate ||
          !data.brand ||
          !data.model ||
          !data.year ||
          !data.color ||
          !data.numberOfSeats
        ) {
          throw new Error(
            'When vehicleId is not provided, all vehicle fields (licensePlate, brand, model, year, color, numberOfSeats) are required'
          )
        }

        const vehicle = await Vehicle.create(
          {
            licensePlate: data.licensePlate,
            brand: data.brand,
            model: data.model,
            year: data.year,
            color: data.color,
            numberOfSeats: data.numberOfSeats,
            vehicleType: data.vehicleType || 'aircraft',
            status: data.status || 'available',
          },
          { client: trx }
        )
        vehicleId = vehicle.id
      }

      // Create aircraft
      const aircraft = await Aircraft.create(
        {
          vehicleId: vehicleId,
          airlineId: data.airlineId,
          registrationCountry: data.registrationCountry,
          maxAltitude: data.maxAltitude,
        },
        { client: trx }
      )

      await trx.commit()

      await aircraft.load('vehicle')
      await aircraft.load('airline')

      return aircraft
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Update aircraft
   */
  async updateAircraft(
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
      airlineId?: number
      registrationCountry?: string
      maxAltitude?: number
    }
  ): Promise<Aircraft | null> {
    const aircraft = await Aircraft.find(id)

    if (!aircraft) {
      return null
    }

    const trx = await db.transaction()

    try {
      await aircraft.load('vehicle')

      // Update vehicle data if provided
      const vehicleData: any = {}
      if (data.licensePlate !== undefined) vehicleData.licensePlate = data.licensePlate
      if (data.brand !== undefined) vehicleData.brand = data.brand
      if (data.model !== undefined) vehicleData.model = data.model
      if (data.year !== undefined) vehicleData.year = data.year
      if (data.color !== undefined) vehicleData.color = data.color
      if (data.numberOfSeats !== undefined) vehicleData.numberOfSeats = data.numberOfSeats
      if (data.vehicleType !== undefined) vehicleData.vehicleType = data.vehicleType
      if (data.status !== undefined) vehicleData.status = data.status

      if (Object.keys(vehicleData).length > 0) {
        aircraft.vehicle.useTransaction(trx)
        aircraft.vehicle.merge(vehicleData)
        await aircraft.vehicle.save()
      }

      // Update aircraft data if provided
      const aircraftData: any = {}
      if (data.airlineId !== undefined) aircraftData.airlineId = data.airlineId
      if (data.registrationCountry !== undefined)
        aircraftData.registrationCountry = data.registrationCountry
      if (data.maxAltitude !== undefined) aircraftData.maxAltitude = data.maxAltitude

      if (Object.keys(aircraftData).length > 0) {
        aircraft.useTransaction(trx)
        aircraft.merge(aircraftData)
        await aircraft.save()
      }

      await trx.commit()

      await aircraft.load('vehicle')
      await aircraft.load('airline')

      return aircraft
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Delete aircraft
   */
  async deleteAircraft(id: number): Promise<boolean> {
    const aircraft = await Aircraft.find(id)

    if (!aircraft) {
      return false
    }

    const trx = await db.transaction()

    try {
      aircraft.useTransaction(trx)
      await aircraft.delete()

      await trx.commit()
      return true
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
