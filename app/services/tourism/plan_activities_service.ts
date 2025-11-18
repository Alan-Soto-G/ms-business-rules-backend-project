import PlanActivity from '#models/tourism/plan_activity'
import Plan from '#models/core/plan'
import TouristActivity from '#models/tourism/tourist_activity'

export default class PlanActivitiesService {
  /**
   * Get all plan activities with optional pagination
   */
  async getAllPlanActivities(page?: number, limit?: number) {
    if (page && limit) {
      return await PlanActivity.query().preload('plan').preload('activity').paginate(page, limit)
    }

    return await PlanActivity.query().preload('plan').preload('activity')
  }

  /**
   * Get plan activity by ID
   */
  async getPlanActivityById(id: number) {
    return await PlanActivity.query().where('id', id).preload('plan').preload('activity').first()
  }

  /**
   * Get all activities by plan
   */
  async getActivitiesByPlan(planId: number) {
    return await PlanActivity.query()
      .where('plan_id', planId)
      .orderBy('order', 'asc')
      .preload('plan')
      .preload('activity')
  }

  /**
   * Get all plans by activity
   */
  async getPlansByActivity(activityId: number) {
    return await PlanActivity.query()
      .where('activity_id', activityId)
      .preload('plan')
      .preload('activity')
  }

  /**
   * Create a new plan activity
   * A) Validates existence of Plan and TouristActivity
   * B) Prevents duplicates
   * C) Inserts cleanly into pivot table
   */
  async createPlanActivity(data: { plan_id: number; activity_id: number; order?: number }) {
    // A) Validate existence of Plan
    const plan = await Plan.find(data.plan_id)
    if (!plan) {
      throw new Error(`Plan with ID ${data.plan_id} does not exist`)
    }

    // A) Validate existence of TouristActivity
    const activity = await TouristActivity.find(data.activity_id)
    if (!activity) {
      throw new Error(`Tourist activity with ID ${data.activity_id} does not exist`)
    }

    // B) Check for duplicate assignment
    const existingAssignment = await PlanActivity.query()
      .where('plan_id', data.plan_id)
      .where('activity_id', data.activity_id)
      .first()

    if (existingAssignment) {
      throw new Error(`Activity ${data.activity_id} is already assigned to plan ${data.plan_id}`)
    }

    // C) Insert cleanly into pivot table
    // If order is not provided, get the next order number for this plan
    let orderNumber = data.order
    if (!orderNumber) {
      const lastActivity = await PlanActivity.query()
        .where('plan_id', data.plan_id)
        .orderBy('order', 'desc')
        .first()

      orderNumber = lastActivity ? lastActivity.order + 1 : 1
    }

    const planActivity = await PlanActivity.create({
      planId: data.plan_id,
      activityId: data.activity_id,
      order: orderNumber,
    })

    await planActivity.load('plan')
    await planActivity.load('activity')

    return planActivity
  }

  /**
   * Assign an activity to a plan
   * D) Allows multiple assignments (multiple activities per plan or multiple plans per activity)
   */
  async assignPlanActivity(data: { plan_id: number; activity_id: number; order?: number }) {
    // Reuse the same logic as create (validates, prevents duplicates, inserts cleanly)
    return await this.createPlanActivity(data)
  }

  /**
   * Unassign an activity from a plan
   */
  async unassignPlanActivity(planId: number, activityId: number) {
    const planActivity = await PlanActivity.query()
      .where('plan_id', planId)
      .where('activity_id', activityId)
      .first()

    if (!planActivity) {
      return false
    }

    await planActivity.delete()
    return true
  }

  /**
   * Update a plan activity
   */
  async updatePlanActivity(
    id: number,
    data: {
      plan_id?: number
      activity_id?: number
      order?: number
    }
  ) {
    const planActivity = await PlanActivity.find(id)

    if (!planActivity) {
      return null
    }

    // Validate new plan_id if provided
    if (data.plan_id && data.plan_id !== planActivity.planId) {
      const plan = await Plan.find(data.plan_id)
      if (!plan) {
        throw new Error(`Plan with ID ${data.plan_id} does not exist`)
      }

      // Check for duplicate with new plan_id
      const existingAssignment = await PlanActivity.query()
        .where('plan_id', data.plan_id)
        .where('activity_id', data.activity_id || planActivity.activityId)
        .whereNot('id', id)
        .first()

      if (existingAssignment) {
        throw new Error(
          `Activity ${data.activity_id || planActivity.activityId} is already assigned to plan ${data.plan_id}`
        )
      }
    }

    // Validate new activity_id if provided
    if (data.activity_id && data.activity_id !== planActivity.activityId) {
      const activity = await TouristActivity.find(data.activity_id)
      if (!activity) {
        throw new Error(`Tourist activity with ID ${data.activity_id} does not exist`)
      }

      // Check for duplicate with new activity_id
      const existingAssignment = await PlanActivity.query()
        .where('plan_id', data.plan_id || planActivity.planId)
        .where('activity_id', data.activity_id)
        .whereNot('id', id)
        .first()

      if (existingAssignment) {
        throw new Error(
          `Activity ${data.activity_id} is already assigned to plan ${data.plan_id || planActivity.planId}`
        )
      }
    }

    // Update fields
    if (data.plan_id) planActivity.planId = data.plan_id
    if (data.activity_id) planActivity.activityId = data.activity_id
    if (data.order) planActivity.order = data.order

    await planActivity.save()
    await planActivity.load('plan')
    await planActivity.load('activity')

    return planActivity
  }

  /**
   * Delete a plan activity
   */
  async deletePlanActivity(id: number) {
    const planActivity = await PlanActivity.find(id)

    if (!planActivity) {
      return false
    }

    await planActivity.delete()
    return true
  }
}
