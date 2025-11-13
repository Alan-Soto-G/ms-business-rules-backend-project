import type { HttpContext } from '@adonisjs/core/http'
import TouristActivity from '#models/tourist_activity'
import {
  createTouristActivityValidator,
  updateTouristActivityValidator,
} from '#validators/tourist_activity'

export default class TouristActivitiesController {
  public async findTouristActivity({ response, request, params }: HttpContext) {
    if (params.id) {
      const theActivity: TouristActivity = await TouristActivity.findOrFail(params.id)
      await theActivity.load('municipality')
      // await theActivity.load('guides') // Comentado temporalmente hasta que se ejecuten las migraciones
      // await theActivity.load('plans') // Comentado temporalmente hasta que se ejecuten las migraciones
      return response.status(200).json(theActivity)
    } else {
      const dataActivities = request.all()
      if ('page' in dataActivities && 'per_page' in dataActivities) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const activities = await TouristActivity.query()
          .preload('municipality')
          .paginate(page, perPage)
        return response.status(200).json(activities)
      }

      const allActivities: TouristActivity[] = await TouristActivity.query().preload('municipality')
      return response.status(200).json(allActivities)
    }
  }

  public async createTouristActivity({ request, response }: HttpContext) {
    const data = await request.validateUsing(createTouristActivityValidator)
    const theActivity = await TouristActivity.create(data)
    await theActivity.load('municipality')
    // await theActivity.load('guides') // Comentado temporalmente hasta que se ejecuten las migraciones
    // await theActivity.load('plans') // Comentado temporalmente hasta que se ejecuten las migraciones
    return response.status(201).json(theActivity)
  }

  public async updateTouristActivity({ params, request, response }: HttpContext) {
    const theActivity: TouristActivity = await TouristActivity.findOrFail(params.id)
    const data = await request.validateUsing(updateTouristActivityValidator)
    theActivity.merge(data)
    await theActivity.save()
    await theActivity.load('municipality')
    // await theActivity.load('guides') // Comentado temporalmente hasta que se ejecuten las migraciones
    // await theActivity.load('plans') // Comentado temporalmente hasta que se ejecuten las migraciones
    return response.status(200).json(theActivity)
  }

  public async deleteTouristActivity({ params, response }: HttpContext) {
    const theActivity: TouristActivity = await TouristActivity.findOrFail(params.id)
    await theActivity.delete()
    return response.status(200).json({ message: 'Tourist activity deleted successfully' })
  }
}
