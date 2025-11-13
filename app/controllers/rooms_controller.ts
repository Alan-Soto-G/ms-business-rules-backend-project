import type { HttpContext } from '@adonisjs/core/http'
import Room from '#models/room'
import { createRoomValidator, updateRoomValidator } from '#validators/room'

export default class RoomsController {
  public async findRoom({ response, request, params }: HttpContext) {
    if (params.id) {
      const theRoom: Room = await Room.query()
        .where('id', params.id)
        .preload('hotel' as any)
        .firstOrFail()
      return response.status(200).json(theRoom)
    } else {
      const dataRooms = request.all()
      if ('page' in dataRooms && 'per_page' in dataRooms) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const rooms = await Room.query()
          .preload('hotel' as any)
          .paginate(page, perPage)
        return response.status(200).json(rooms)
      }

      const allRooms: Room[] = await Room.query().preload('hotel' as any)
      return response.status(200).json(allRooms)
    }
  }

  public async createRoom({ request, response }: HttpContext) {
    const data = await request.validateUsing(createRoomValidator)

    const roomData = {
      hotelId: data.hotelId,
      roomNumber: data.roomNumber,
      roomType: data.roomType,
      capacity: data.capacity,
      pricePerNight: data.pricePerNight,
      status: data.status || 'available',
    }

    const theRoom = await Room.create(roomData)
    await theRoom.load('hotel' as any)

    return response.status(201).json(theRoom)
  }

  public async updateRoom({ request, response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Room ID not provided' })
    }

    const data = await request.validateUsing(updateRoomValidator)
    const room: Room = await Room.findOrFail(params.id)

    const roomData: any = {}
    if (data.hotelId !== undefined) roomData.hotelId = data.hotelId
    if (data.roomNumber !== undefined) roomData.roomNumber = data.roomNumber
    if (data.roomType !== undefined) roomData.roomType = data.roomType
    if (data.capacity !== undefined) roomData.capacity = data.capacity
    if (data.pricePerNight !== undefined) roomData.pricePerNight = data.pricePerNight
    if (data.status !== undefined) roomData.status = data.status

    if (Object.keys(roomData).length > 0) {
      room.merge(roomData)
      await room.save()
    }

    await room.load('hotel' as any)

    return response.status(200).json(room)
  }

  public async deleteRoom({ response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Room ID not provided' })
    }
    const room: Room = await Room.findOrFail(params.id)
    await room.delete()

    return response.status(200).json({ message: 'Room deleted successfully' })
  }
}
