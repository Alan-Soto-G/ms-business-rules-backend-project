import GuideActivity from '#models/tourism/guide_activity'
import Guide from '#models/tourism/guide'
import TouristActivity from '#models/tourism/tourist_activity'
import { DateTime } from 'luxon'

export default class GuideActivitiesService {
  /**
   * Get all guide activities with optional pagination
   */
  async getAllGuideActivities(page?: number, limit?: number) {
    if (page && limit) {
      return await GuideActivity.query().preload('guide').preload('activity').paginate(page, limit)
    }

    return await GuideActivity.query().preload('guide').preload('activity')
  }

  /**
   * Get guide activity by ID
   */
  async getGuideActivityById(id: number) {
    return await GuideActivity.query()
      .where('id', id)
      .preload('guide')
      .preload('activity')
      .first()
  }

  /**
   * Get all activities by guide
   */
  async getActivitiesByGuide(guideId: number) {
    return await GuideActivity.query()
      .where('guide_id', guideId)
      .preload('guide')
      .preload('activity')
  }

  /**
   * Get all guides by activity
   */
  async getGuidesByActivity(activityId: number) {
    return await GuideActivity.query()
      .where('activity_id', activityId)
      .preload('guide')
      .preload('activity')
  }

  /**
   * Create a new guide activity
   * A) Validates existence of Guide and TouristActivity
   * B) Prevents duplicates
   * C) Inserts cleanly into pivot table
   */
  async createGuideActivity(data: {
    guide_id: number
    activity_id: number
    assignment_date?: DateTime
  }) {
    // A) Validate existence of Guide
    const guide = await Guide.find(data.guide_id)
    if (!guide) {
      throw new Error(`Guide with ID ${data.guide_id} does not exist`)
    }

    // A) Validate existence of TouristActivity
    const activity = await TouristActivity.find(data.activity_id)
    if (!activity) {
      throw new Error(`Tourist activity with ID ${data.activity_id} does not exist`)
    }

    // B) Check for duplicate assignment
    const existingAssignment = await GuideActivity.query()
      .where('guide_id', data.guide_id)
      .where('activity_id', data.activity_id)
      .first()

    if (existingAssignment) {
      throw new Error(`Guide ${data.guide_id} is already assigned to activity ${data.activity_id}`)
    }

    // C) Insert cleanly into pivot table
    const guideActivity = await GuideActivity.create({
      guideId: data.guide_id,
      activityId: data.activity_id,
      assignmentDate: data.assignment_date || DateTime.now(),
    })

    await guideActivity.load('guide')
    await guideActivity.load('activity')

    return guideActivity
  }

  /**
   * Assign a guide to an activity
   * D) Allows multiple assignments (multiple activities per guide or multiple guides per activity)
   */
  async assignGuideActivity(data: {
    guide_id: number
    activity_id: number
    assignment_date?: DateTime
  }) {
    // Reuse the same logic as create (validates, prevents duplicates, inserts cleanly)
    return await this.createGuideActivity(data)
  }

  /**
   * Unassign a guide from an activity
   */
  async unassignGuideActivity(guideId: number, activityId: number) {
    const guideActivity = await GuideActivity.query()
      .where('guide_id', guideId)
      .where('activity_id', activityId)
      .first()

    if (!guideActivity) {
      return false
    }

    await guideActivity.delete()
    return true
  }

  /**
   * Update a guide activity
   */
  async updateGuideActivity(
    id: number,
    data: {
      guide_id?: number
      activity_id?: number
      assignment_date?: DateTime
    }
  ) {
    const guideActivity = await GuideActivity.find(id)

    if (!guideActivity) {
      return null
    }

    // Validate new guide_id if provided
    if (data.guide_id && data.guide_id !== guideActivity.guideId) {
      const guide = await Guide.find(data.guide_id)
      if (!guide) {
        throw new Error(`Guide with ID ${data.guide_id} does not exist`)
      }

      // Check for duplicate with new guide_id
      const existingAssignment = await GuideActivity.query()
        .where('guide_id', data.guide_id)
        .where('activity_id', data.activity_id || guideActivity.activityId)
        .whereNot('id', id)
        .first()

      if (existingAssignment) {
        throw new Error(
          `Guide ${data.guide_id} is already assigned to activity ${data.activity_id || guideActivity.activityId}`
        )
      }
    }

    // Validate new activity_id if provided
    if (data.activity_id && data.activity_id !== guideActivity.activityId) {
      const activity = await TouristActivity.find(data.activity_id)
      if (!activity) {
        throw new Error(`Tourist activity with ID ${data.activity_id} does not exist`)
      }

      // Check for duplicate with new activity_id
      const existingAssignment = await GuideActivity.query()
        .where('guide_id', data.guide_id || guideActivity.guideId)
        .where('activity_id', data.activity_id)
        .whereNot('id', id)
        .first()

      if (existingAssignment) {
        throw new Error(
          `Guide ${data.guide_id || guideActivity.guideId} is already assigned to activity ${data.activity_id}`
        )
      }
    }

    // Update fields
    if (data.guide_id) guideActivity.guideId = data.guide_id
    if (data.activity_id) guideActivity.activityId = data.activity_id
    if (data.assignment_date) guideActivity.assignmentDate = data.assignment_date

    await guideActivity.save()
    await guideActivity.load('guide')
    await guideActivity.load('activity')

    return guideActivity
  }

  /**
   * Delete a guide activity
   */
  async deleteGuideActivity(id: number) {
    const guideActivity = await GuideActivity.find(id)

    if (!guideActivity) {
      return false
    }

    await guideActivity.delete()
    return true
  }
}
