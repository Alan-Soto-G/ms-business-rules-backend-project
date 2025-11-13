import type { HttpContext } from '@adonisjs/core/http'
import Guide from '#models/guide'
import TouristActivity from '#models/tourist_activity'

export default class GuideTouristActivitiesController {
  // Obtener todas las actividades turísticas de un guía
  public async index({ params, response }: HttpContext) {
    const guide = await Guide.findOrFail(params.guideId)
    await guide.load('touristActivities')
    return response.status(200).json(guide.touristActivities)
  }

  // Asociar una actividad turística a un guía
  public async store({ params, response }: HttpContext) {
    const guide = await Guide.findOrFail(params.guideId)
    const activity = await TouristActivity.findOrFail(params.activityId)

    // Verificar si ya existe la relación
    await guide.load('touristActivities')
    const exists = guide.touristActivities.find((a) => a.id === activity.id)

    if (exists) {
      return response
        .status(409)
        .json({ message: 'This activity is already associated with this guide' })
    }

    await guide.related('touristActivities').attach([activity.id])
    return response.status(201).json({ message: 'Activity associated with guide successfully' })
  }

  // Eliminar la asociación de una actividad turística con un guía
  public async destroy({ params, response }: HttpContext) {
    const guide = await Guide.findOrFail(params.guideId)
    const activity = await TouristActivity.findOrFail(params.activityId)

    await guide.related('touristActivities').detach([activity.id])
    return response.status(200).json({ message: 'Activity removed from guide successfully' })
  }
}

