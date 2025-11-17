import type { HttpContext } from '@adonisjs/core/http'
import BookingsService from '#services/accommodation/bookings_service'

export default class BookingsController {
  private bookingsService: BookingsService

  constructor() {
    this.bookingsService = new BookingsService()
  }

  /**
   * Get all bookings of a trip
   * GET /trips/:tripId/bookings
   */
  public async index({ params, response }: HttpContext) {
    try {
      const bookings = await this.bookingsService.getTripRooms(params.tripId)
      return response.status(200).json(bookings)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Add a room booking to a trip
   * POST /trips/:tripId/bookings/:roomId
   */
  public async store({ params, response }: HttpContext) {
    try {
      const booking = await this.bookingsService.addRoomToTrip(params.tripId, params.roomId)
      return response.status(201).json(booking)
    } catch (error) {
      if (error.message.includes('already associated')) {
        return response.status(409).json({ message: error.message })
      }
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Remove a booking from a trip
   * DELETE /trips/:tripId/bookings/:roomId
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const result = await this.bookingsService.removeRoomFromTrip(params.tripId, params.roomId)
      return response.status(200).json(result)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
