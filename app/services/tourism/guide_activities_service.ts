import GuideActivity from '#models/tourism/guide_activity'
import Guide from '#models/tourism/guide'
import TouristActivity from '#models/tourism/tourist_activity'

// Guide Activities Service
export default class GuideActivitiesService {
  /**
   * Get all guide activities with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = GuideActivity.query().preload('guide').preload('activity')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a guide activity by ID
   */
  async findById(id: number) {
    return await GuideActivity.query()
      .where('id', id)
      .preload('guide')
      .preload('activity')
      .firstOrFail()
  }

  /**
   * Create a new guide activity
   */
  async create(data: any) {
    // Validate that guide and activity exist
    const guide = await Guide.findOrFail(data.guideId)
    const activity = await TouristActivity.findOrFail(data.activityId)

    // Check if relationship already exists
    const exists = await GuideActivity.query()
      .where('guide_id', guide.id)
      .where('activity_id', activity.id)
      .first()

    if (exists) {
      throw new Error('This activity is already assigned to this guide')
    }

    const guideActivity = await GuideActivity.create(data)
    await guideActivity.load('guide')
    await guideActivity.load('activity')
    return guideActivity
  }

  /**
   * Update a guide activity
   */
  async update(id: number, data: any) {
    const guideActivity = await GuideActivity.findOrFail(id)
    guideActivity.merge(data)
    await guideActivity.save()
    return guideActivity
  }

  /**
   * Delete a guide activity
   */
  async delete(id: number) {
    const guideActivity = await GuideActivity.findOrFail(id)
    await guideActivity.delete()
    return guideActivity
  }

  /**
   * Get all activities for a guide
   */
  async getGuideActivities(guideId: number) {
    const guide = await Guide.findOrFail(guideId)
    await guide.load('guideActivities', (query) => {
      query.preload('activity')
    })
    return guide.guideActivities
  }

  /**
   * Remove activity from guide
   */
  async removeActivityFromGuide(guideId: number, activityId: number) {
    const guideActivity = await GuideActivity.query()
      .where('guide_id', guideId)
      .where('activity_id', activityId)
      .firstOrFail()

    await guideActivity.delete()
    return { message: 'Activity removed from guide successfully' }
  }
}
