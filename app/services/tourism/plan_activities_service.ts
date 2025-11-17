import PlanActivity from '#models/tourism/plan_activity'
import Plan from '#models/core/plan'
import TouristActivity from '#models/tourism/tourist_activity'

// Plan Activities Service
export default class PlanActivitiesService {
  /**
   * Get all plan activities with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = PlanActivity.query().preload('plan').preload('activity')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a plan activity by ID
   */
  async findById(id: number) {
    return await PlanActivity.query()
      .where('id', id)
      .preload('plan')
      .preload('activity')
      .firstOrFail()
  }

  /**
   * Create a new plan activity
   */
  async create(data: any) {
    // Validate that plan and activity exist
    const plan = await Plan.findOrFail(data.planId)
    const activity = await TouristActivity.findOrFail(data.activityId)

    // Check if relationship already exists
    const exists = await PlanActivity.query()
      .where('plan_id', plan.id)
      .where('activity_id', activity.id)
      .first()

    if (exists) {
      throw new Error('This activity is already in this plan')
    }

    const planActivity = await PlanActivity.create(data)
    await planActivity.load('plan')
    await planActivity.load('activity')
    return planActivity
  }

  /**
   * Update a plan activity
   */
  async update(id: number, data: any) {
    const planActivity = await PlanActivity.findOrFail(id)
    planActivity.merge(data)
    await planActivity.save()
    return planActivity
  }

  /**
   * Delete a plan activity
   */
  async delete(id: number) {
    const planActivity = await PlanActivity.findOrFail(id)
    await planActivity.delete()
    return planActivity
  }

  /**
   * Get all activities for a plan
   */
  async getPlanActivities(planId: number) {
    const plan = await Plan.findOrFail(planId)
    await plan.load('planActivities', (query) => {
      query.preload('activity')
    })
    return plan.planActivities
  }

  /**
   * Remove activity from plan
   */
  async removeActivityFromPlan(planId: number, activityId: number) {
    const planActivity = await PlanActivity.query()
      .where('plan_id', planId)
      .where('activity_id', activityId)
      .firstOrFail()

    await planActivity.delete()
    return { message: 'Activity removed from plan successfully' }
  }
}
