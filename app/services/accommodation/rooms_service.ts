import Room from '#models/accommodation/room'

export default class RoomsService {
  /**
   * Get all rooms with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Room.query().preload('hotel').preload('bookings')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a room by ID
   */
  async findById(id: number) {
    return await Room.query().where('id', id).preload('hotel').preload('bookings').firstOrFail()
  }

  /**
   * Create a new room
   */
  async create(data: any) {
    return await Room.create(data)
  }

  /**
   * Update a room
   */
  async update(id: number, data: any) {
    const room = await Room.findOrFail(id)
    room.merge(data)
    await room.save()
    return room
  }

  /**
   * Delete a room
   */
  async delete(id: number) {
    const room = await Room.findOrFail(id)
    await room.delete()
    return room
  }
}
