import TouristActivity from '#models/tourism/tourist_activity'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class TouristActivitiesService {
  /**
   * Get all tourist activities with optional pagination
   */
  async getAllTouristActivities(
    page?: number,
    limit?: number
  ): Promise<TouristActivity[] | ModelPaginatorContract<TouristActivity>> {
    const query = TouristActivity.query()
      .preload('municipality')
      .preload('guideActivities')
      .preload('planActivities')
      .orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get tourist activity by ID
   */
  async getTouristActivityById(id: number): Promise<TouristActivity | null> {
    return await TouristActivity.query()
      .where('id', id)
      .preload('municipality')
      .preload('guideActivities')
      .preload('planActivities')
      .first()
  }

  /**
   * Create new tourist activity
   */
  async createTouristActivity(data: {
    municipalityId: number
    name: string
    description?: string
    price?: number | null
    duration?: number | null
    category?:
      | 'cultural'
      | 'adventure'
      | 'gastronomic'
      | 'recreational'
      | 'ecological'
      | 'aquatic'
      | 'other'
  }): Promise<TouristActivity> {
    const touristActivity = await TouristActivity.create(data)

    await touristActivity.load('municipality')
    await touristActivity.load('guideActivities')
    await touristActivity.load('planActivities')

    return touristActivity
  }

  /**
   * Update tourist activity
   */
  async updateTouristActivity(
    id: number,
    data: {
      municipalityId?: number
      name?: string
      description?: string
      price?: number | null
      duration?: number | null
      category?:
        | 'cultural'
        | 'adventure'
        | 'gastronomic'
        | 'recreational'
        | 'ecological'
        | 'aquatic'
        | 'other'
    }
  ): Promise<TouristActivity | null> {
    const touristActivity = await TouristActivity.find(id)

    if (!touristActivity) {
      return null
    }

    touristActivity.merge(data)
    await touristActivity.save()

    await touristActivity.load('municipality')
    await touristActivity.load('guideActivities')
    await touristActivity.load('planActivities')

    return touristActivity
  }

  /**
   * Delete tourist activity
   */
  async deleteTouristActivity(id: number): Promise<boolean> {
    const touristActivity = await TouristActivity.find(id)

    if (!touristActivity) {
      return false
    }

    await touristActivity.delete()
    return true
  }
}
