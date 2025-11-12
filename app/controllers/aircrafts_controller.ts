import type { HttpContext } from '@adonisjs/core/http'
import Aircraft from '#models/aircraft'
import Vehicle from '#models/vehicle'
import { createAircraftValidator, updateAircraftValidator } from '#validators/aircraft'

export default class AircraftsController {
  public async findAircraft({ response, request, params }: HttpContext) {
    if (params.id) {
      const theAircraft: Aircraft = await Aircraft.findOrFail(params.id)
      await theAircraft.load('vehicle')
      await theAircraft.load('airline')
      return response.status(200).json(theAircraft)
    } else {
      const dataAircrafts = request.all()
      if ('page' in dataAircrafts && 'per_page' in dataAircrafts) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const aircrafts = await Aircraft.query()
          .preload('vehicle')
          .preload('airline')
          .paginate(page, perPage)
        return response.status(200).json(aircrafts)
      }

      const allAircrafts: Aircraft[] = await Aircraft.query().preload('vehicle').preload('airline')
      return response.status(200).json(allAircrafts)
    }
  }

  public async createAircraft({ request, response }: HttpContext) {
    const data = await request.validateUsing(createAircraftValidator)

    // Primero crear el vehículo con los datos correspondientes
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

    // Luego crear la aeronave con el vehicleId y los datos específicos
    const aircraftData = {
      vehicleId: vehicle.id,
      airlineId: data.airlineId,
      registrationCountry: data.registrationCountry,
      maxAltitude: data.maxAltitude || null,
    }

    const theAircraft = await Aircraft.create(aircraftData)
    await theAircraft.load('vehicle')
    await theAircraft.load('airline')

    return response.status(201).json(theAircraft)
  }

  public async updateAircraft({ request, response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Aircraft ID not provided' })
    }

    const data = await request.validateUsing(updateAircraftValidator)
    const aircraft: Aircraft = await Aircraft.findOrFail(params.id)
    await aircraft.load('vehicle')

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
      aircraft.vehicle.merge(vehicleData)
      await aircraft.vehicle.save()
    }

    // Actualizar la aeronave con datos específicos
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

    return response.status(200).json(aircraft)
  }

  public async deleteAircraft({ response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Aircraft ID not provided' })
    }
    const aircraft: Aircraft = await Aircraft.findOrFail(params.id)
    await aircraft.load('vehicle')

    // Eliminar el vehículo (esto también eliminará la aeronave por CASCADE)
    await aircraft.vehicle.delete()

    return response.status(200).json({ message: 'Aircraft deleted successfully' })
  }
}
