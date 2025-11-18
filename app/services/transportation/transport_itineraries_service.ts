import TransportItinerary from '#models/transportation/transport_itinerary'
import Journey from '#models/transportation/journey'
import Trip from '#models/core/trip'
import TransportationService from '#models/transportation/transportation_service'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class TransportItinerariesService {
  /**
   * Get all transport itineraries with optional pagination
   */
  async getAllTransportItineraries(
    page?: number,
    limit?: number
  ): Promise<TransportItinerary[] | ModelPaginatorContract<TransportItinerary>> {
    const query = TransportItinerary.query()
      .preload('journey', (journeyQuery) => {
        journeyQuery.preload('originMunicipality').preload('destinationMunicipality')
      })
      .preload('trip')
      .preload('transportationService')
      .orderBy('order', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get transport itinerary by ID
   */
  async getTransportItineraryById(id: number): Promise<TransportItinerary | null> {
    return await TransportItinerary.query()
      .where('id', id)
      .preload('journey', (journeyQuery) => {
        journeyQuery.preload('originMunicipality').preload('destinationMunicipality')
      })
      .preload('trip')
      .preload('transportationService')
      .first()
  }

  /**
   * Create new transport itinerary (pivot table entry)
   * A) Validates existence of journey and trip
   * B) Prevents duplicates
   * C) Inserts cleanly into pivot table
   */
  async createTransportItinerary(data: {
    journeyId: number
    tripId: number
    transportationServiceId: number
    order: number
  }): Promise<TransportItinerary> {
    // A) Validate existence of journey
    const journey = await Journey.find(data.journeyId)
    if (!journey) {
      throw new Error(`Journey with ID ${data.journeyId} does not exist`)
    }

    // A) Validate existence of trip
    const trip = await Trip.find(data.tripId)
    if (!trip) {
      throw new Error(`Trip with ID ${data.tripId} does not exist`)
    }

    // Validate existence of transportation service
    const transportationService = await TransportationService.find(data.transportationServiceId)
    if (!transportationService) {
      throw new Error(
        `Transportation service with ID ${data.transportationServiceId} does not exist`
      )
    }

    // B) Prevent duplicates - check if itinerary already exists
    const existingItinerary = await TransportItinerary.query()
      .where('journey_id', data.journeyId)
      .where('trip_id', data.tripId)
      .where('order', data.order)
      .first()

    if (existingItinerary) {
      throw new Error(
        `Transport itinerary for journey ${data.journeyId} and trip ${data.tripId} with order ${data.order} already exists`
      )
    }

    // C) Insert cleanly into pivot table
    const transportItinerary = await TransportItinerary.create(data)

    await transportItinerary.load('journey', (journeyQuery) => {
      journeyQuery.preload('originMunicipality').preload('destinationMunicipality')
    })
    await transportItinerary.load('trip')
    await transportItinerary.load('transportationService')

    return transportItinerary
  }

  /**
   * Assign transport itinerary (same as create, but more semantic for N:N relationships)
   * D) Allows multiple assignments
   */
  async assignTransportItinerary(data: {
    journeyId: number
    tripId: number
    transportationServiceId: number
    order: number
  }): Promise<TransportItinerary> {
    return await this.createTransportItinerary(data)
  }

  /**
   * Unassign transport itinerary (delete the relationship)
   */
  async unassignTransportItinerary(journeyId: number, tripId: number): Promise<boolean> {
    const transportItinerary = await TransportItinerary.query()
      .where('journey_id', journeyId)
      .where('trip_id', tripId)
      .first()

    if (!transportItinerary) {
      return false
    }

    await transportItinerary.delete()
    return true
  }

  /**
   * Get all transport itineraries by journey
   */
  async getTransportItinerariesByJourney(journeyId: number): Promise<TransportItinerary[]> {
    return await TransportItinerary.query()
      .where('journey_id', journeyId)
      .preload('trip')
      .preload('transportationService')
      .orderBy('order', 'asc')
  }

  /**
   * Get all transport itineraries by trip
   */
  async getTransportItinerariesByTrip(tripId: number): Promise<TransportItinerary[]> {
    return await TransportItinerary.query()
      .where('trip_id', tripId)
      .preload('journey', (journeyQuery) => {
        journeyQuery.preload('originMunicipality').preload('destinationMunicipality')
      })
      .preload('transportationService')
      .orderBy('order', 'asc')
  }

  /**
   * Update transport itinerary
   */
  async updateTransportItinerary(
    id: number,
    data: {
      journeyId?: number
      tripId?: number
      transportationServiceId?: number
      order?: number
    }
  ): Promise<TransportItinerary | null> {
    const transportItinerary = await TransportItinerary.find(id)

    if (!transportItinerary) {
      return null
    }

    // Validate existence if journey is being updated
    if (data.journeyId) {
      const journey = await Journey.find(data.journeyId)
      if (!journey) {
        throw new Error(`Journey with ID ${data.journeyId} does not exist`)
      }
    }

    // Validate existence if trip is being updated
    if (data.tripId) {
      const trip = await Trip.find(data.tripId)
      if (!trip) {
        throw new Error(`Trip with ID ${data.tripId} does not exist`)
      }
    }

    // Validate existence if transportation service is being updated
    if (data.transportationServiceId) {
      const transportationService = await TransportationService.find(data.transportationServiceId)
      if (!transportationService) {
        throw new Error(
          `Transportation service with ID ${data.transportationServiceId} does not exist`
        )
      }
    }

    // Check for duplicates if journey/trip/order are being changed
    if (data.journeyId || data.tripId || data.order) {
      const newJourneyId = data.journeyId || transportItinerary.journeyId
      const newTripId = data.tripId || transportItinerary.tripId
      const newOrder = data.order || transportItinerary.order

      const existingItinerary = await TransportItinerary.query()
        .where('journey_id', newJourneyId)
        .where('trip_id', newTripId)
        .where('order', newOrder)
        .whereNot('id', id)
        .first()

      if (existingItinerary) {
        throw new Error(
          `Transport itinerary for journey ${newJourneyId} and trip ${newTripId} with order ${newOrder} already exists`
        )
      }
    }

    transportItinerary.merge(data)
    await transportItinerary.save()

    await transportItinerary.load('journey', (journeyQuery) => {
      journeyQuery.preload('originMunicipality').preload('destinationMunicipality')
    })
    await transportItinerary.load('trip')
    await transportItinerary.load('transportationService')

    return transportItinerary
  }

  /**
   * Delete transport itinerary
   */
  async deleteTransportItinerary(id: number): Promise<boolean> {
    const transportItinerary = await TransportItinerary.find(id)

    if (!transportItinerary) {
      return false
    }

    await transportItinerary.delete()
    return true
  }
}
