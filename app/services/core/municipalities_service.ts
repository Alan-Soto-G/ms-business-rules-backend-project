import Municipality from '#models/core/municipality'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class MunicipalitiesService {
  /**
   * Get all municipalities with optional pagination
   */
  async getAllMunicipalities(
    page?: number,
    limit?: number
  ): Promise<Municipality[] | ModelPaginatorContract<Municipality>> {
    const query = Municipality.query()
      .preload('originJourneys')
      .preload('destinationJourneys')
      .preload('hotels')
      .preload('touristActivities')
      .orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get municipality by ID
   */
  async getMunicipalityById(id: number): Promise<Municipality | null> {
    return await Municipality.query()
      .where('id', id)
      .preload('originJourneys')
      .preload('destinationJourneys')
      .preload('hotels')
      .preload('touristActivities')
      .first()
  }

  /**
   * Create new municipality
   */
  async createMunicipality(data: {
    name: string
    department: string
    code: string
  }): Promise<Municipality> {
    const municipality = await Municipality.create(data)

    return municipality
  }

  /**
   * Update municipality
   */
  async updateMunicipality(
    id: number,
    data: {
      name?: string
      department?: string
      code?: string
    }
  ): Promise<Municipality | null> {
    const municipality = await Municipality.find(id)

    if (!municipality) {
      return null
    }

    municipality.merge(data)
    await municipality.save()

    await municipality.load('originJourneys')
    await municipality.load('destinationJourneys')
    await municipality.load('hotels')
    await municipality.load('touristActivities')

    return municipality
  }

  /**
   * Delete municipality
   */
  async deleteMunicipality(id: number): Promise<boolean> {
    const municipality = await Municipality.find(id)

    if (!municipality) {
      return false
    }

    await municipality.delete()
    return true
  }
}

