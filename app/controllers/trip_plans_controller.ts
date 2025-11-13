import type { HttpContext } from '@adonisjs/core/http'
import TripPlan from '#models/trip_plan'
import Trip from '#models/trip'
import Plan from '#models/plan'

export default class TripPlansController {
  // Obtener todos los planes de un viaje
  public async index({ params, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.tripId)
    await trip.load('tripPlans', (query) => {
      query.preload('plan')
    })
    return response.status(200).json(trip.tripPlans)
  }

  // Asociar un plan a un viaje
  public async store({ params, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.tripId)
    const plan = await Plan.findOrFail(params.planId)

    // Verificar si ya existe la relación
    const exists = await TripPlan.query()
      .where('trip_id', trip.id)
      .where('plan_id', plan.id)
      .first()

    if (exists) {
      return response
        .status(409)
        .json({ message: 'This plan is already associated with this trip' })
    }

    const tripPlan = await TripPlan.create({
      tripId: trip.id,
      planId: plan.id,
    })

    await tripPlan.load('plan')
    return response.status(201).json(tripPlan)
  }

  // Eliminar la asociación de un plan con un viaje
  public async destroy({ params, response }: HttpContext) {
    const tripPlan = await TripPlan.query()
      .where('trip_id', params.tripId)
      .where('plan_id', params.planId)
      .firstOrFail()

    await tripPlan.delete()
    return response.status(200).json({ message: 'Plan removed from trip successfully' })
  }
}
