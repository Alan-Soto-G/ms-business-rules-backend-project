import Guide from '#models/tourism/guide'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class GuidesService {
  /**
   * Get all guides with optional pagination
   */
  async getAllGuides(
    page?: number,
    limit?: number
  ): Promise<Guide[] | ModelPaginatorContract<Guide>> {
    const query = Guide.query().preload('touristActivities').orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get guide by ID
   */
  async getGuideById(id: number): Promise<Guide | null> {
    return await Guide.query().where('id', id).preload('touristActivities').first()
  }

  /**
   * Create new guide
   */
  async createGuide(data: {
    userId: string
    licenseNumber: string
    specialties?: string
    rating?: number
    isAvailable?: boolean
  }): Promise<Guide> {
    const guide = await Guide.create(data)

    await guide.load('touristActivities')

    return guide
  }

  /**
   * Update guide
   */
  async updateGuide(
    id: number,
    data: {
      userId?: string
      licenseNumber?: string
      specialties?: string
      rating?: number
      isAvailable?: boolean
    }
  ): Promise<Guide | null> {
    const guide = await Guide.find(id)

    if (!guide) {
      return null
    }

    guide.merge(data)
    await guide.save()

    await guide.load('touristActivities')

    return guide
  }

  /**
   * Delete guide
   */
  async deleteGuide(id: number): Promise<boolean> {
    const guide = await Guide.find(id)

    if (!guide) {
      return false
    }

    await guide.delete()
    return true
  }
}

