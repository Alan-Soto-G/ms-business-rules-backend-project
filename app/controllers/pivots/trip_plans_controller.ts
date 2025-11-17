import type { HttpContext } from '@adonisjs/core/http'
import TripPlansService from '#services/pivots/trip_plans_service'

export default class TripPlansController {
  private tripPlansService: TripPlansService

  constructor() {
    this.tripPlansService = new TripPlansService()
  }

  // Obtener todos los planes de un viaje
  public async index({ params, response }: HttpContext) {
    try {
      const tripPlans = await this.tripPlansService.getTripPlans(params.tripId)
      return response.status(200).json(tripPlans)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  // Asociar un plan a un viaje
  public async store({ params, response }: HttpContext) {
    try {
      const tripPlan = await this.tripPlansService.addPlanToTrip(params.tripId, params.planId)
      return response.status(201).json(tripPlan)
    } catch (error) {
      if (error.message.includes('already associated')) {
        return response.status(409).json({ message: error.message })
      }
      return response.status(404).json({ message: error.message })
    }
  }

  // Eliminar la asociación de un plan con un viaje
  public async destroy({ params, response }: HttpContext) {
    try {
      const result = await this.tripPlansService.removePlanFromTrip(params.tripId, params.planId)
      return response.status(200).json(result)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
