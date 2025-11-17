import TouristActivity from '#models/tourism/tourist_activity'

export default class TouristActivitiesService {
  /**
   * Get all tourist activities
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = TouristActivity.query()
      .preload('municipality')
      .preload('guideActivities')
      .preload('planActivities')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a tourist activity by ID
   */
  async findById(id: number) {
    return await TouristActivity.query()
      .where('id', id)
      .preload('municipality')
      .preload('guideActivities')
      .preload('planActivities')
      .firstOrFail()
  }

  /**
   * Create a new tourist activity
   */
  async create(data: any) {
    return await TouristActivity.create(data)
  }

  /**
   * Update a tourist activity
   */
  async update(id: number, data: any) {
    const touristActivity = await TouristActivity.findOrFail(id)
    touristActivity.merge(data)
    await touristActivity.save()
    return touristActivity
  }

  /**
   * Delete a tourist activity
   */
  async delete(id: number) {
    const touristActivity = await TouristActivity.findOrFail(id)
    await touristActivity.delete()
    return touristActivity
  }
}
