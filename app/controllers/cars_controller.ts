import type { HttpContext } from '@adonisjs/core/http'
import Car from '#models/car'
import Vehicle from '#models/vehicle'
import { createCarValidator, updateCarValidator } from '#validators/car'

export default class CarsController {
  public async findCar({ response, request, params }: HttpContext) {
    if (params.id) {
      const theCar: Car = await Car.findOrFail(params.id)
      await theCar.load('vehicle')
      await theCar.load('hotel')
      return response.status(200).json(theCar)
    } else {
      const dataCars = request.all()
      if ('page' in dataCars && 'per_page' in dataCars) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const cars = await Car.query().preload('vehicle').preload('hotel').paginate(page, perPage)
        return response.status(200).json(cars)
      }

      const allCars: Car[] = await Car.query().preload('vehicle').preload('hotel')
      return response.status(200).json(allCars)
    }
  }

  public async createCar({ request, response }: HttpContext) {
    const data = await request.validateUsing(createCarValidator)

    // Primero crear el vehículo con los datos correspondientes
    const vehicleData = {
      licensePlate: data.licensePlate,
      brand: data.brand,
      model: data.model,
      year: data.year,
      color: data.color,
      numberOfSeats: data.numberOfSeats,
      vehicleType: data.vehicleType || 'car',
      status: data.status || 'available',
    }

    const vehicle = await Vehicle.create(vehicleData)

    // Luego crear el carro con el vehicleId y los datos específicos
    const carData = {
      vehicleId: vehicle.id,
      hotelId: data.hotelId,
      fuelType: data.fuelType,
      transmissionType: data.transmissionType,
    }

    const theCar = await Car.create(carData)
    await theCar.load('vehicle')
    await theCar.load('hotel')

    return response.status(201).json(theCar)
  }

  public async updateCar({ request, response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Car ID not provided' })
    }

    const data = await request.validateUsing(updateCarValidator)
    const car: Car = await Car.findOrFail(params.id)
    await car.load('vehicle')

    // Actualizar el vehículo si hay datos de vehículo
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
      car.vehicle.merge(vehicleData)
      await car.vehicle.save()
    }

    // Actualizar el carro con datos específicos
    const carData: any = {}
    if (data.hotelId) carData.hotelId = data.hotelId
    if (data.fuelType) carData.fuelType = data.fuelType
    if (data.transmissionType) carData.transmissionType = data.transmissionType

    if (Object.keys(carData).length > 0) {
      car.merge(carData)
      await car.save()
    }

    await car.load('vehicle')
    await car.load('hotel')

    return response.status(200).json(car)
  }

  public async deleteCar({ response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Car ID not provided' })
    }
    const car: Car = await Car.findOrFail(params.id)
    await car.load('vehicle')

    // Eliminar el vehículo (esto también eliminará el carro por CASCADE)
    await car.vehicle.delete()

    return response.status(200).json({ message: 'Car deleted successfully' })
  }
}
