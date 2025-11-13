import type { HttpContext } from '@adonisjs/core/http'
import Plan from '#models/plan'
import TouristActivity from '#models/tourist_activity'

export default class PlanTouristActivitiesController {
  // Obtener todas las actividades turísticas de un plan
  public async index({ params, response }: HttpContext) {
    const plan = await Plan.findOrFail(params.planId)
    await plan.load('touristActivities')
    return response.status(200).json(plan.touristActivities)
  }

  // Asociar una actividad turística a un plan
  public async store({ params, response }: HttpContext) {
    const plan = await Plan.findOrFail(params.planId)
    const activity = await TouristActivity.findOrFail(params.activityId)

    // Verificar si ya existe la relación
    await plan.load('touristActivities')
    const exists = plan.touristActivities.find((a) => a.id === activity.id)

    if (exists) {
      return response
        .status(409)
        .json({ message: 'This activity is already associated with this plan' })
    }

    await plan.related('touristActivities').attach([activity.id])
    return response.status(201).json({ message: 'Activity associated with plan successfully' })
  }

  // Eliminar la asociación de una actividad turística con un plan
  public async destroy({ params, response }: HttpContext) {
    const plan = await Plan.findOrFail(params.planId)
    const activity = await TouristActivity.findOrFail(params.activityId)

    await plan.related('touristActivities').detach([activity.id])
    return response.status(200).json({ message: 'Activity removed from plan successfully' })
  }
}

