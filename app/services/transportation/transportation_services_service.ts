import TransportationService from '#models/transportation/transportation_service'
import Vehicle from '#models/transportation/vehicle'
import Journey from '#models/transportation/journey'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

export default class TransportationServicesService {
  /**
   * Get all transportation services with optional pagination
   */
  async getAllTransportationServices(
    page?: number,
    limit?: number
  ): Promise<TransportationService[] | ModelPaginatorContract<TransportationService>> {
    const query = TransportationService.query()
      .preload('journey', (journeyQuery) => {
        journeyQuery.preload('originMunicipality').preload('destinationMunicipality')
      })
      .preload('vehicle')
      .orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get transportation service by ID
   */
  async getTransportationServiceById(id: number): Promise<TransportationService | null> {
    return await TransportationService.query()
      .where('id', id)
      .preload('journey', (journeyQuery) => {
        journeyQuery.preload('originMunicipality').preload('destinationMunicipality')
      })
      .preload('vehicle')
      .first()
  }

  /**
   * Create new transportation service (pivot table entry)
   * A) Validates existence of both vehicle and journey
   * B) Prevents duplicates
   * C) Inserts cleanly into pivot table
   */
  async createTransportationService(data: {
    journeyId: number
    vehicleId: number
    startDate: DateTime
    endDate: DateTime
    cost: number
  }): Promise<TransportationService> {
    // A) Validate existence of journey
    const journey = await Journey.find(data.journeyId)
    if (!journey) {
      throw new Error(`Journey with ID ${data.journeyId} does not exist`)
    }

    // A) Validate existence of vehicle
    const vehicle = await Vehicle.find(data.vehicleId)
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${data.vehicleId} does not exist`)
    }

    // Validate date logic
    if (data.endDate <= data.startDate) {
      throw new Error('End date must be after start date')
    }

    // B) Prevent duplicates - check if transportation service already exists
    const existingService = await TransportationService.query()
      .where('journey_id', data.journeyId)
      .where('vehicle_id', data.vehicleId)
      .where('start_date', data.startDate.toISO()!)
      .first()

    if (existingService) {
      throw new Error(
        `Transportation service for journey ${data.journeyId} and vehicle ${data.vehicleId} at this time already exists`
      )
    }

    // C) Insert cleanly into pivot table
    const transportationService = await TransportationService.create(data)

    await transportationService.load('journey', (journeyQuery) => {
      journeyQuery.preload('originMunicipality').preload('destinationMunicipality')
    })
    await transportationService.load('vehicle')

    return transportationService
  }

  /**
   * Assign transportation service (same as create, but more semantic for N:N relationships)
   * D) Allows multiple assignments
   */
  async assignTransportationService(data: {
    journeyId: number
    vehicleId: number
    startDate: DateTime
    endDate: DateTime
    cost: number
  }): Promise<TransportationService> {
    return await this.createTransportationService(data)
  }

  /**
   * Unassign transportation service (delete the relationship)
   */
  async unassignTransportationService(journeyId: number, vehicleId: number): Promise<boolean> {
    const transportationService = await TransportationService.query()
      .where('journey_id', journeyId)
      .where('vehicle_id', vehicleId)
      .first()

    if (!transportationService) {
      return false
    }

    await transportationService.delete()
    return true
  }

  /**
   * Get all transportation services by journey
   */
  async getTransportationServicesByJourney(journeyId: number): Promise<TransportationService[]> {
    return await TransportationService.query()
      .where('journey_id', journeyId)
      .preload('vehicle')
      .orderBy('start_date', 'asc')
  }

  /**
   * Get all transportation services by vehicle
   */
  async getTransportationServicesByVehicle(vehicleId: number): Promise<TransportationService[]> {
    return await TransportationService.query()
      .where('vehicle_id', vehicleId)
      .preload('journey', (journeyQuery) => {
        journeyQuery.preload('originMunicipality').preload('destinationMunicipality')
      })
      .orderBy('start_date', 'asc')
  }

  /**
   * Update transportation service
   */
  async updateTransportationService(
    id: number,
    data: {
      journeyId?: number
      vehicleId?: number
      startDate?: DateTime
      endDate?: DateTime
      cost?: number
    }
  ): Promise<TransportationService | null> {
    const transportationService = await TransportationService.find(id)

    if (!transportationService) {
      return null
    }

    // Validate existence if journey is being updated
    if (data.journeyId) {
      const journey = await Journey.find(data.journeyId)
      if (!journey) {
        throw new Error(`Journey with ID ${data.journeyId} does not exist`)
      }
    }

    // Validate existence if vehicle is being updated
    if (data.vehicleId) {
      const vehicle = await Vehicle.find(data.vehicleId)
      if (!vehicle) {
        throw new Error(`Vehicle with ID ${data.vehicleId} does not exist`)
      }
    }

    // Validate date logic
    const newStartDate = data.startDate || transportationService.startDate
    const newEndDate = data.endDate || transportationService.endDate

    if (newEndDate <= newStartDate) {
      throw new Error('End date must be after start date')
    }

    // Check for duplicates if journey/vehicle are being changed
    if (data.journeyId || data.vehicleId || data.startDate) {
      const newJourneyId = data.journeyId || transportationService.journeyId
      const newVehicleId = data.vehicleId || transportationService.vehicleId
      const newStart = data.startDate || transportationService.startDate

      const existingService = await TransportationService.query()
        .where('journey_id', newJourneyId)
        .where('vehicle_id', newVehicleId)
        .where('start_date', newStart.toISO()!)
        .whereNot('id', id)
        .first()

      if (existingService) {
        throw new Error(
          `Transportation service for journey ${newJourneyId} and vehicle ${newVehicleId} at this time already exists`
        )
      }
    }

    transportationService.merge(data)
    await transportationService.save()

    await transportationService.load('journey', (journeyQuery) => {
      journeyQuery.preload('originMunicipality').preload('destinationMunicipality')
    })
    await transportationService.load('vehicle')

    return transportationService
  }

  /**
   * Delete transportation service
   */
  async deleteTransportationService(id: number): Promise<boolean> {
    const transportationService = await TransportationService.find(id)

    if (!transportationService) {
      return false
    }

    await transportationService.delete()
    return true
  }
}
