import type { HttpContext } from '@adonisjs/core/http'
import BookingsService from '#services/accommodation/bookings_service'
import {
  createBookingValidator,
  updateBookingValidator,
  assignBookingValidator,
} from '#validators/accommodation/booking'

export default class BookingsController {
  private bookingsService: BookingsService

  constructor() {
    this.bookingsService = new BookingsService()
  }

  /**
   * GET /bookings
   * Get all bookings with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const bookings = await this.bookingsService.getAllBookings(page, limit)

      return response.ok({
        message: 'Bookings retrieved successfully',
        data: bookings,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving bookings',
        error: error.message,
      })
    }
  }

  /**
   * GET /bookings/:id
   * Get booking by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const booking = await this.bookingsService.getBookingById(params.id)

      if (!booking) {
        return response.notFound({
          message: 'Booking not found',
        })
      }

      return response.ok({
        message: 'Booking retrieved successfully',
        data: booking,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving booking',
        error: error.message,
      })
    }
  }

  /**
   * GET /bookings/trip/:tripId
   * Get all rooms by trip
   */
  async getByTrip({ params, response }: HttpContext) {
    try {
      const rooms = await this.bookingsService.getRoomsByTrip(params.tripId)

      return response.ok({
        message: 'Rooms by trip retrieved successfully',
        data: rooms,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving rooms by trip',
        error: error.message,
      })
    }
  }

  /**
   * GET /bookings/room/:roomId
   * Get all trips by room
   */
  async getByRoom({ params, response }: HttpContext) {
    try {
      const trips = await this.bookingsService.getTripsByRoom(params.roomId)

      return response.ok({
        message: 'Trips by room retrieved successfully',
        data: trips,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving trips by room',
        error: error.message,
      })
    }
  }

  /**
   * POST /bookings
   * Create new booking
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createBookingValidator)

      const booking = await this.bookingsService.createBooking(data)

      return response.created({
        message: 'Booking created successfully',
        data: booking,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.message.includes('does not exist')) {
        return response.badRequest({
          message: error.message,
        })
      }

      if (error.message.includes('already booked')) {
        return response.conflict({
          message: error.message,
        })
      }

      return response.internalServerError({
        message: 'Error creating booking',
        error: error.message,
      })
    }
  }

  /**
   * POST /bookings/assign
   * Assign room to trip (book a room)
   */
  async assign({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(assignBookingValidator)

      const booking = await this.bookingsService.assignBooking(data)

      return response.created({
        message: 'Room booked for trip successfully',
        data: booking,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.message.includes('does not exist')) {
        return response.badRequest({
          message: error.message,
        })
      }

      if (error.message.includes('already booked')) {
        return response.conflict({
          message: error.message,
        })
      }

      return response.internalServerError({
        message: 'Error booking room for trip',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /bookings/unassign/:tripId/:roomId
   * Unassign room from trip (cancel booking)
   */
  async unassign({ params, response }: HttpContext) {
    try {
      const deleted = await this.bookingsService.unassignBooking(params.tripId, params.roomId)

      if (!deleted) {
        return response.notFound({
          message: 'Booking not found',
        })
      }

      return response.ok({
        message: 'Booking cancelled successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error cancelling booking',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /bookings/:id
   * Update booking
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateBookingValidator)

      const booking = await this.bookingsService.updateBooking(params.id, data)

      if (!booking) {
        return response.notFound({
          message: 'Booking not found',
        })
      }

      return response.ok({
        message: 'Booking updated successfully',
        data: booking,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.message.includes('does not exist')) {
        return response.badRequest({
          message: error.message,
        })
      }

      if (error.message.includes('already booked')) {
        return response.conflict({
          message: error.message,
        })
      }

      return response.internalServerError({
        message: 'Error updating booking',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /bookings/:id
   * Delete booking
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.bookingsService.deleteBooking(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Booking not found',
        })
      }

      return response.ok({
        message: 'Booking deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting booking',
        error: error.message,
      })
    }
  }
}
