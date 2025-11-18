import Room from '#models/accommodation/room'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class RoomsService {
  /**
   * Get all rooms with optional pagination
   */
  async getAllRooms(
    page?: number,
    limit?: number
  ): Promise<Room[] | ModelPaginatorContract<Room>> {
    const query = Room.query().preload('hotel').preload('bookings').orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get room by ID
   */
  async getRoomById(id: number): Promise<Room | null> {
    return await Room.query().where('id', id).preload('hotel').preload('bookings').first()
  }

  /**
   * Create new room
   */
  async createRoom(data: {
    hotelId: number
    roomNumber: string
    roomType: string
    capacity: number
    pricePerNight: number
    status?: 'available' | 'occupied' | 'maintenance' | 'cleaning'
  }): Promise<Room> {
    const room = await Room.create(data)

    await room.load('hotel')

    return room
  }

  /**
   * Update room
   */
  async updateRoom(
    id: number,
    data: {
      hotelId?: number
      roomNumber?: string
      roomType?: string
      capacity?: number
      pricePerNight?: number
      status?: 'available' | 'occupied' | 'maintenance' | 'cleaning'
    }
  ): Promise<Room | null> {
    const room = await Room.find(id)

    if (!room) {
      return null
    }

    room.merge(data)
    await room.save()

    await room.load('hotel')
    await room.load('bookings')

    return room
  }

  /**
   * Delete room
   */
  async deleteRoom(id: number): Promise<boolean> {
    const room = await Room.find(id)

    if (!room) {
      return false
    }

    await room.delete()
    return true
  }
}

