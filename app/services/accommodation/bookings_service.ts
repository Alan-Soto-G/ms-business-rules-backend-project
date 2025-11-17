import { Trip } from '#models/core/index'
import { Room, Booking } from '#models/accommodation/index'
import BookingModel from '#models/accommodation/booking'
export default class BookingsService {
  /**
   * Get all bookings with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = BookingModel.query().preload('trip').preload('room')
    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }
    return await query
  }
  /**
   * Get a booking by ID
   */
  async findById(id: number) {
    return await BookingModel.query().where('id', id).preload('trip').preload('room').firstOrFail()
  }
  /**
   * Create a new booking
   */
  async create(data: any) {
    return await BookingModel.create(data)
  }
  /**
   * Update a booking
   */
  async update(id: number, data: any) {
    const booking = await BookingModel.findOrFail(id)
    booking.merge(data)
    await booking.save()
    return booking
  }
  /**
   * Delete a booking
   */
  async delete(id: number) {
    const booking = await BookingModel.findOrFail(id)
    await booking.delete()
    return booking
  }
  // Get all rooms for a trip
  async getTripRooms(tripId: number) {
    const trip = await Trip.findOrFail(tripId)
    await trip.load('Bookings', (query) => {
      query.preload('room')
    })
    return trip.Bookings
  }
  // Associate a room with a trip
  async addRoomToTrip(tripId: number, roomId: number) {
    const trip = await Trip.findOrFail(tripId)
    const room = await Room.findOrFail(roomId)
    const exists = await Booking.query().where('trip_id', trip.id).where('room_id', room.id).first()
    if (exists) {
      throw new Error('This room is already associated with this trip')
    }
    const tripRoom = await Booking.create({
      tripId: trip.id,
      roomId: room.id,
    })
    await tripRoom.load('room')
    return tripRoom
  }
  // Remove room association from a trip
  async removeRoomFromTrip(tripId: number, roomId: number) {
    const tripRoom = await Booking.query()
      .where('trip_id', tripId)
      .where('room_id', roomId)
      .firstOrFail()
    await tripRoom.delete()
    return { message: 'Room removed from trip successfully' }
  }
}
