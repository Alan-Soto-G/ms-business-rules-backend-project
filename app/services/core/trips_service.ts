import Trip from '#models/core/trip'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

export default class TripsService {
  /**
   * Get all trips with optional pagination
   */
  async getAllTrips(
    page?: number,
    limit?: number
  ): Promise<Trip[] | ModelPaginatorContract<Trip>> {
    const query = Trip.query()
      .preload('tripClients')
      .preload('tripPlans')
      .preload('bookings')
      .preload('transportItineraries')
      .orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get trip by ID
   */
  async getTripById(id: number): Promise<Trip | null> {
    return await Trip.query()
      .where('id', id)
      .preload('tripClients')
      .preload('tripPlans')
      .preload('bookings')
      .preload('transportItineraries')
      .first()
  }

  /**
   * Create new trip
   */
  async createTrip(data: {
    name: string
    description?: string
    destination: string
    startDate: DateTime
    endDate: DateTime
    price: number
    capacity: number
    availableSeats: number
    status?: 'draft' | 'published' | 'active' | 'full' | 'completed' | 'cancelled'
  }): Promise<Trip> {
    const trip = await Trip.create(data)

    await trip.load('tripClients')
    await trip.load('tripPlans')
    await trip.load('bookings')
    await trip.load('transportItineraries')

    return trip
  }

  /**
   * Update trip
   */
  async updateTrip(
    id: number,
    data: {
      name?: string
      description?: string
      destination?: string
      startDate?: DateTime
      endDate?: DateTime
      price?: number
      capacity?: number
      availableSeats?: number
      status?: 'draft' | 'published' | 'active' | 'full' | 'completed' | 'cancelled'
    }
  ): Promise<Trip | null> {
    const trip = await Trip.find(id)

    if (!trip) {
      return null
    }

    trip.merge(data)
    await trip.save()

    await trip.load('tripClients')
    await trip.load('tripPlans')
    await trip.load('bookings')
    await trip.load('transportItineraries')

    return trip
  }

  /**
   * Delete trip
   */
  async deleteTrip(id: number): Promise<boolean> {
    const trip = await Trip.find(id)

    if (!trip) {
      return false
    }

    await trip.delete()
    return true
  }
}