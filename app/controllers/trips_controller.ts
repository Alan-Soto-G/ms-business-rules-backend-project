import type { HttpContext } from '@adonisjs/core/http'
import Trip from '#models/trip'
import { createTripValidator, updateTripValidator } from '#validators/trip'
import { DateTime } from 'luxon'

export default class TripsController {
  // GET ALL
  public async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 20)
    const trips = await Trip.query().paginate(page, perPage)
    return response.ok(trips)
  }

  // GET BY ID
  public async show({ params, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.id)
    await trip.load('fees')
    await trip.load('clients')
    await trip.load('plans')
    await trip.load('rooms')
    await trip.load('itinerary')
    return response.ok(trip)
  }

  // CREATE
  public async store({ request, response }: HttpContext) {
    const body = await request.validateUsing(createTripValidator)

    // 🔁 Convertir fechas y asegurar nombres coherentes
    const data = {
      name: body.name,
      description: body.description,
      destination: body.destination,
      startDate: DateTime.fromISO(`${body.startDate}T00:00:00`),
      endDate: DateTime.fromISO(`${body.endDate}T00:00:00`),
      price: Number(body.price),
      capacity: Number(body.capacity),
      availableSeats: Number(body.availableSeats),
      status: body.status,
    }

    console.log('📦 Datos a insertar:', data)

    const trip = await Trip.create(data)
    return response.created(trip)
  }

  public async update({ params, request, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.id)
    const updates = await request.validateUsing(updateTripValidator)

    // ⚡ Force merge sin que TypeScript se queje
    trip.merge(updates as any)
    await trip.save()
    return response.ok(trip)
  }

  // DELETE
  public async destroy({ params, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.id)
    await trip.delete()
    return response.ok({ message: 'Trip deleted successfully' })
  }
}
