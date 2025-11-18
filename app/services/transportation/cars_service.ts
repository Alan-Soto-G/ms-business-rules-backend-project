import Car from '#models/transportation/car'
import Vehicle from '#models/transportation/vehicle'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import db from '@adonisjs/lucid/services/db'

export default class CarsService {
  /**
   * Get all cars with optional pagination
   */
  async getAllCars(page?: number, limit?: number): Promise<Car[] | ModelPaginatorContract<Car>> {
    const query = Car.query().preload('vehicle').preload('hotel').orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get car by ID
   */
  async getCarById(id: number): Promise<Car | null> {
    return await Car.query().where('id', id).preload('vehicle').preload('hotel').first()
  }

  /**
   * Create new car
   * Supports two scenarios:
   * A) vehicleId provided: associate with existing vehicle
   * B) vehicleId not provided: create new vehicle first
   */
  async createCar(data: {
    vehicleId?: number
    licensePlate?: string
    brand?: string
    model?: string
    year?: number
    color?: string
    numberOfSeats?: number
    vehicleType?: string
    status?: 'available' | 'in_use' | 'maintenance' | 'retired'
    hotelId: number
    fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg'
    transmissionType: 'manual' | 'automatic' | 'cvt'
  }): Promise<Car> {
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
            vehicleType: data.vehicleType || 'car',
            status: data.status || 'available',
          },
          { client: trx }
        )
        vehicleId = vehicle.id
      }

      // Create car
      const car = await Car.create(
        {
          vehicleId: vehicleId,
          hotelId: data.hotelId,
          fuelType: data.fuelType,
          transmissionType: data.transmissionType,
        },
        { client: trx }
      )

      await trx.commit()

      await car.load('vehicle')
      await car.load('hotel')

      return car
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Update car
   */
  async updateCar(
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
      hotelId?: number
      fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg'
      transmissionType?: 'manual' | 'automatic' | 'cvt'
    }
  ): Promise<Car | null> {
    const car = await Car.find(id)

    if (!car) {
      return null
    }

    const trx = await db.transaction()

    try {
      await car.load('vehicle')

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
        car.vehicle.useTransaction(trx)
        car.vehicle.merge(vehicleData)
        await car.vehicle.save()
      }

      // Update car data if provided
      const carData: any = {}
      if (data.hotelId !== undefined) carData.hotelId = data.hotelId
      if (data.fuelType !== undefined) carData.fuelType = data.fuelType
      if (data.transmissionType !== undefined) carData.transmissionType = data.transmissionType

      if (Object.keys(carData).length > 0) {
        car.useTransaction(trx)
        car.merge(carData)
        await car.save()
      }

      await trx.commit()

      await car.load('vehicle')
      await car.load('hotel')

      return car
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Delete car
   */
  async deleteCar(id: number): Promise<boolean> {
    const car = await Car.find(id)

    if (!car) {
      return false
    }

    const trx = await db.transaction()

    try {
      car.useTransaction(trx)
      await car.delete()

      await trx.commit()
      return true
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
