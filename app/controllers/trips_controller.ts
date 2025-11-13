import type { HttpContext } from '@adonisjs/core/http'
import Trip from '#models/trip'
import { createTripValidator, updateTripValidator } from '#validators/trip'

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
    await trip.load('tripClients')
    await trip.load('tripPlans')
    await trip.load('tripRoutes')
    await trip.load('tripRooms')
    return response.ok(trip)
  }

  // CREATE
  public async store({ request, response }: HttpContext) {
    const body = await request.validateUsing(createTripValidator)
    const trip = await Trip.create(body)
    return response.created(trip)
  }

  // UPDATE
  public async update({ params, request, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.id)
    const updates = await request.validateUsing(updateTripValidator)
    trip.merge(updates)
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
