import Plan from '#models/core/plan'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class PlansService {
  /**
   * Get all plans with optional pagination
   */
  async getAllPlans(
    page?: number,
    limit?: number
  ): Promise<Plan[] | ModelPaginatorContract<Plan>> {
    const query = Plan.query()
      .preload('planActivities')
      .preload('tripPlans')
      .orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get plan by ID
   */
  async getPlanById(id: number): Promise<Plan | null> {
    return await Plan.query()
      .where('id', id)
      .preload('planActivities')
      .preload('tripPlans')
      .first()
  }

  /**
   * Create new plan
   */
  async createPlan(data: {
    name: string
    description?: string
    price: number
    duration?: number
  }): Promise<Plan> {
    const plan = await Plan.create(data)

    await plan.load('planActivities')
    await plan.load('tripPlans')

    return plan
  }

  /**
   * Update plan
   */
  async updatePlan(
    id: number,
    data: {
      name?: string
      description?: string
      price?: number
      duration?: number
    }
  ): Promise<Plan | null> {
    const plan = await Plan.find(id)

    if (!plan) {
      return null
    }

    plan.merge(data)
    await plan.save()

    await plan.load('planActivities')
    await plan.load('tripPlans')

    return plan
  }

  /**
   * Delete plan
   */
  async deletePlan(id: number): Promise<boolean> {
    const plan = await Plan.find(id)

    if (!plan) {
      return false
    }

    await plan.delete()
    return true
  }
}

