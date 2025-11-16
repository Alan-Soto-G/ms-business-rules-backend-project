import type { HttpContext } from '@adonisjs/core/http'
import TripRoom from '#models/booking'
import Trip from '#models/trip'
import Room from '#models/room'

export default class TripRoomsController {
  // Obtener todas las habitaciones de un viaje
  public async index({ params, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.tripId)
    await trip.load('tripRooms', (query) => {
      query.preload('room')
    })
    return response.status(200).json(trip.tripRooms)
  }

  // Asociar una habitación a un viaje
  public async store({ params, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.tripId)
    const room = await Room.findOrFail(params.roomId)

    // Verificar si ya existe la relación
    const exists = await TripRoom.query()
      .where('trip_id', trip.id)
      .where('room_id', room.id)
      .first()

    if (exists) {
      return response
        .status(409)
        .json({ message: 'This room is already associated with this trip' })
    }

    const tripRoom = await TripRoom.create({
      tripId: trip.id,
      roomId: room.id,
    })

    await tripRoom.load('room')
    return response.status(201).json(tripRoom)
  }

  // Eliminar la asociación de una habitación con un viaje
  public async destroy({ params, response }: HttpContext) {
    const tripRoom = await TripRoom.query()
      .where('trip_id', params.tripId)
      .where('room_id', params.roomId)
      .firstOrFail()

    await tripRoom.delete()
    return response.status(200).json({ message: 'Room removed from trip successfully' })
  }
}
