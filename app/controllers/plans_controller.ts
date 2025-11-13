import type { HttpContext } from '@adonisjs/core/http'
import Plan from '#models/plan'
import { createPlanValidator, updatePlanValidator } from '#validators/plan'

export default class PlansController {
  public async findPlan({ response, request, params }: HttpContext) {
    if (params.id) {
      const thePlan: Plan = await Plan.findOrFail(params.id)
      await thePlan.load('touristActivities')
      await thePlan.load('trips')
      return response.status(200).json(thePlan)
    } else {
      const dataPlans = request.all()
      if ('page' in dataPlans && 'per_page' in dataPlans) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const plans = await Plan.query().paginate(page, perPage)
        return response.status(200).json(plans)
      }

      const allPlans: Plan[] = await Plan.query()
      return response.status(200).json(allPlans)
    }
  }

  public async createPlan({ request, response }: HttpContext) {
    const data = await request.validateUsing(createPlanValidator)
    const thePlan = await Plan.create(data)
    await thePlan.load('touristActivities')
    await thePlan.load('trips')
    return response.status(201).json(thePlan)
  }

  public async updatePlan({ params, request, response }: HttpContext) {
    const thePlan: Plan = await Plan.findOrFail(params.id)
    const data = await request.validateUsing(updatePlanValidator)
    thePlan.merge(data)
    await thePlan.save()
    await thePlan.load('touristActivities')
    await thePlan.load('trips')
    return response.status(200).json(thePlan)
  }

  public async deletePlan({ params, response }: HttpContext) {
    const thePlan: Plan = await Plan.findOrFail(params.id)
    await thePlan.delete()
    return response.status(200).json({ message: 'Plan deleted successfully' })
  }
}
