import Booking from '#models/accommodation/booking'
import Trip from '#models/core/trip'
import Room from '#models/accommodation/room'

export default class BookingsService {
  /**
   * Get all bookings with optional pagination
   */
  async getAllBookings(page?: number, limit?: number) {
    if (page && limit) {
      return await Booking.query().preload('trip').preload('room').paginate(page, limit)
    }

    return await Booking.query().preload('trip').preload('room')
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: number) {
    return await Booking.query().where('id', id).preload('trip').preload('room').first()
  }

  /**
   * Get all rooms by trip
   */
  async getRoomsByTrip(tripId: number) {
    return await Booking.query().where('trip_id', tripId).preload('trip').preload('room')
  }

  /**
   * Get all trips by room
   */
  async getTripsByRoom(roomId: number) {
    return await Booking.query().where('room_id', roomId).preload('trip').preload('room')
  }

  /**
   * Create a new booking
   * A) Validates existence of Trip and Room
   * B) Prevents duplicates
   * C) Inserts cleanly into pivot table
   */
  async createBooking(data: { trip_id: number; room_id: number }) {
    // A) Validate existence of Trip
    const trip = await Trip.find(data.trip_id)
    if (!trip) {
      throw new Error(`Trip with ID ${data.trip_id} does not exist`)
    }

    // A) Validate existence of Room
    const room = await Room.find(data.room_id)
    if (!room) {
      throw new Error(`Room with ID ${data.room_id} does not exist`)
    }

    // B) Check for duplicate booking
    const existingBooking = await Booking.query()
      .where('trip_id', data.trip_id)
      .where('room_id', data.room_id)
      .first()

    if (existingBooking) {
      throw new Error(`Room ${data.room_id} is already booked for trip ${data.trip_id}`)
    }

    // C) Insert cleanly into pivot table
    const booking = await Booking.create({
      tripId: data.trip_id,
      roomId: data.room_id,
    })

    await booking.load('trip')
    await booking.load('room')

    return booking
  }

  /**
   * Assign a room to a trip (book a room)
   * D) Allows multiple assignments (multiple rooms per trip or multiple trips per room)
   */
  async assignBooking(data: { trip_id: number; room_id: number }) {
    // Reuse the same logic as create (validates, prevents duplicates, inserts cleanly)
    return await this.createBooking(data)
  }

  /**
   * Unassign a room from a trip (cancel booking)
   */
  async unassignBooking(tripId: number, roomId: number) {
    const booking = await Booking.query()
      .where('trip_id', tripId)
      .where('room_id', roomId)
      .first()

    if (!booking) {
      return false
    }

    await booking.delete()
    return true
  }

  /**
   * Update a booking
   */
  async updateBooking(
    id: number,
    data: {
      trip_id?: number
      room_id?: number
    }
  ) {
    const booking = await Booking.find(id)

    if (!booking) {
      return null
    }

    // Validate new trip_id if provided
    if (data.trip_id && data.trip_id !== booking.tripId) {
      const trip = await Trip.find(data.trip_id)
      if (!trip) {
        throw new Error(`Trip with ID ${data.trip_id} does not exist`)
      }

      // Check for duplicate with new trip_id
      const existingBooking = await Booking.query()
        .where('trip_id', data.trip_id)
        .where('room_id', data.room_id || booking.roomId)
        .whereNot('id', id)
        .first()

      if (existingBooking) {
        throw new Error(
          `Room ${data.room_id || booking.roomId} is already booked for trip ${data.trip_id}`
        )
      }
    }

    // Validate new room_id if provided
    if (data.room_id && data.room_id !== booking.roomId) {
      const room = await Room.find(data.room_id)
      if (!room) {
        throw new Error(`Room with ID ${data.room_id} does not exist`)
      }

      // Check for duplicate with new room_id
      const existingBooking = await Booking.query()
        .where('trip_id', data.trip_id || booking.tripId)
        .where('room_id', data.room_id)
        .whereNot('id', id)
        .first()

      if (existingBooking) {
        throw new Error(
          `Room ${data.room_id} is already booked for trip ${data.trip_id || booking.tripId}`
        )
      }
    }

    // Update fields
    if (data.trip_id) booking.tripId = data.trip_id
    if (data.room_id) booking.roomId = data.room_id

    await booking.save()
    await booking.load('trip')
    await booking.load('room')

    return booking
  }

  /**
   * Delete a booking
   */
  async deleteBooking(id: number) {
    const booking = await Booking.find(id)

    if (!booking) {
      return false
    }

    await booking.delete()
    return true
  }
}
