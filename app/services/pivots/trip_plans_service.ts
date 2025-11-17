import TripPlan from '#models/pivots/trip_plan'
import Trip from '#models/core/trip'
import Plan from '#models/core/plan'

// Trip Plans Service
export default class TripPlansService {
  /**
   * Get all trip plans
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = TripPlan.query().preload('trip').preload('plan')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a trip plan by ID
   */
  async findById(id: number) {
    return await TripPlan.query().where('id', id).preload('trip').preload('plan').firstOrFail()
  }

  /**
   * Create a new trip plan
   */
  async create(data: any) {
    return await TripPlan.create(data)
  }

  /**
   * Update a trip plan
   */
  async update(id: number, data: any) {
    const tripPlan = await TripPlan.findOrFail(id)
    tripPlan.merge(data)
    await tripPlan.save()
    return tripPlan
  }

  /**
   * Delete a trip plan
   */
  async delete(id: number) {
    const tripPlan = await TripPlan.findOrFail(id)
    await tripPlan.delete()
    return tripPlan
  }

  // Get all plans for a trip
  async getTripPlans(tripId: number) {
    const trip = await Trip.findOrFail(tripId)
    await trip.load('tripPlans', (query) => {
      query.preload('plan')
    })
    return trip.tripPlans
  }

  // Associate a plan with a trip
  async addPlanToTrip(tripId: number, planId: number) {
    const trip = await Trip.findOrFail(tripId)
    const plan = await Plan.findOrFail(planId)

    // Check if relationship already exists
    const exists = await TripPlan.query()
      .where('trip_id', trip.id)
      .where('plan_id', plan.id)
      .first()

    if (exists) {
      throw new Error('This plan is already associated with this trip')
    }

    const tripPlan = await TripPlan.create({
      tripId: trip.id,
      planId: plan.id,
    })

    await tripPlan.load('plan')
    return tripPlan
  }

  // Remove plan association from a trip
  async removePlanFromTrip(tripId: number, planId: number) {
    const tripPlan = await TripPlan.query()
      .where('trip_id', tripId)
      .where('plan_id', planId)
      .firstOrFail()

    await tripPlan.delete()
    return { message: 'Plan removed from trip successfully' }
  }
}
