import TripPlan from '#models/pivots/trip_plan'
import Trip from '#models/core/trip'
import Plan from '#models/core/plan'

export default class TripPlansService {
  /**
   * Get all trip plans with optional pagination
   */
  async getAllTripPlans(page?: number, limit?: number) {
    if (page && limit) {
      return await TripPlan.query().preload('trip').preload('plan').paginate(page, limit)
    }

    return await TripPlan.query().preload('trip').preload('plan')
  }

  /**
   * Get trip plan by ID
   */
  async getTripPlanById(id: number) {
    return await TripPlan.query().where('id', id).preload('trip').preload('plan').first()
  }

  /**
   * Get all plans by trip
   */
  async getPlansByTrip(tripId: number) {
    return await TripPlan.query().where('trip_id', tripId).preload('trip').preload('plan')
  }

  /**
   * Get all trips by plan
   */
  async getTripsByPlan(planId: number) {
    return await TripPlan.query().where('plan_id', planId).preload('trip').preload('plan')
  }

  /**
   * Create a new trip plan
   * A) Validates existence of Trip and Plan
   * B) Prevents duplicates
   * C) Inserts cleanly into pivot table
   */
  async createTripPlan(data: { trip_id: number; plan_id: number }) {
    // A) Validate existence of Trip
    const trip = await Trip.find(data.trip_id)
    if (!trip) {
      throw new Error(`Trip with ID ${data.trip_id} does not exist`)
    }

    // A) Validate existence of Plan
    const plan = await Plan.find(data.plan_id)
    if (!plan) {
      throw new Error(`Plan with ID ${data.plan_id} does not exist`)
    }

    // B) Check for duplicate assignment
    const existingAssignment = await TripPlan.query()
      .where('trip_id', data.trip_id)
      .where('plan_id', data.plan_id)
      .first()

    if (existingAssignment) {
      throw new Error(`Plan ${data.plan_id} is already assigned to trip ${data.trip_id}`)
    }

    // C) Insert cleanly into pivot table
    const tripPlan = await TripPlan.create({
      tripId: data.trip_id,
      planId: data.plan_id,
    })

    await tripPlan.load('trip')
    await tripPlan.load('plan')

    return tripPlan
  }

  /**
   * Assign a plan to a trip
   * D) Allows multiple assignments (multiple plans per trip or multiple trips per plan)
   */
  async assignTripPlan(data: { trip_id: number; plan_id: number }) {
    // Reuse the same logic as create (validates, prevents duplicates, inserts cleanly)
    return await this.createTripPlan(data)
  }

  /**
   * Unassign a plan from a trip
   */
  async unassignTripPlan(tripId: number, planId: number) {
    const tripPlan = await TripPlan.query()
      .where('trip_id', tripId)
      .where('plan_id', planId)
      .first()

    if (!tripPlan) {
      return false
    }

    await tripPlan.delete()
    return true
  }

  /**
   * Update a trip plan
   */
  async updateTripPlan(
    id: number,
    data: {
      trip_id?: number
      plan_id?: number
    }
  ) {
    const tripPlan = await TripPlan.find(id)

    if (!tripPlan) {
      return null
    }

    // Validate new trip_id if provided
    if (data.trip_id && data.trip_id !== tripPlan.tripId) {
      const trip = await Trip.find(data.trip_id)
      if (!trip) {
        throw new Error(`Trip with ID ${data.trip_id} does not exist`)
      }

      // Check for duplicate with new trip_id
      const existingAssignment = await TripPlan.query()
        .where('trip_id', data.trip_id)
        .where('plan_id', data.plan_id || tripPlan.planId)
        .whereNot('id', id)
        .first()

      if (existingAssignment) {
        throw new Error(
          `Plan ${data.plan_id || tripPlan.planId} is already assigned to trip ${data.trip_id}`
        )
      }
    }

    // Validate new plan_id if provided
    if (data.plan_id && data.plan_id !== tripPlan.planId) {
      const plan = await Plan.find(data.plan_id)
      if (!plan) {
        throw new Error(`Plan with ID ${data.plan_id} does not exist`)
      }

      // Check for duplicate with new plan_id
      const existingAssignment = await TripPlan.query()
        .where('trip_id', data.trip_id || tripPlan.tripId)
        .where('plan_id', data.plan_id)
        .whereNot('id', id)
        .first()

      if (existingAssignment) {
        throw new Error(
          `Plan ${data.plan_id} is already assigned to trip ${data.trip_id || tripPlan.tripId}`
        )
      }
    }

    // Update fields
    if (data.trip_id) tripPlan.tripId = data.trip_id
    if (data.plan_id) tripPlan.planId = data.plan_id

    await tripPlan.save()
    await tripPlan.load('trip')
    await tripPlan.load('plan')

    return tripPlan
  }

  /**
   * Delete a trip plan
   */
  async deleteTripPlan(id: number) {
    const tripPlan = await TripPlan.find(id)

    if (!tripPlan) {
      return false
    }

    await tripPlan.delete()
    return true
  }
}
