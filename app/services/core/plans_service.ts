import Plan from '#models/core/plan'

export default class PlansService {
  /**
   * Get all plans with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Plan.query().preload('planActivities').preload('tripPlans')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a plan by ID
   */
  async findById(id: number) {
    return await Plan.query()
      .where('id', id)
      .preload('planActivities')
      .preload('tripPlans')
      .firstOrFail()
  }

  /**
   * Create a new plan
   */
  async create(data: any) {
    return await Plan.create(data)
  }

  /**
   * Update a plan
   */
  async update(id: number, data: any) {
    const plan = await Plan.findOrFail(id)
    plan.merge(data)
    await plan.save()
    return plan
  }

  /**
   * Delete a plan
   */
  async delete(id: number) {
    const plan = await Plan.findOrFail(id)
    await plan.delete()
    return plan
  }
}
