import Journey from '#models/transportation/journey'
import Municipality from '#models/core/municipality'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class JourneysService {
  /**
   * Get all journeys with optional pagination
   */
  async getAllJourneys(
    page?: number,
    limit?: number
  ): Promise<Journey[] | ModelPaginatorContract<Journey>> {
    const query = Journey.query()
      .preload('originMunicipality')
      .preload('destinationMunicipality')
      .orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get journey by ID
   */
  async getJourneyById(id: number): Promise<Journey | null> {
    return await Journey.query()
      .where('id', id)
      .preload('originMunicipality')
      .preload('destinationMunicipality')
      .first()
  }

  /**
   * Create new journey (pivot table entry)
   * A) Validates existence of both municipalities
   * B) Prevents duplicates
   * C) Inserts cleanly into pivot table
   */
  async createJourney(data: {
    originMunicipalityId: number
    destinationMunicipalityId: number
    distance?: number
  }): Promise<Journey> {
    // A) Validate existence of origin municipality
    const originMunicipality = await Municipality.find(data.originMunicipalityId)
    if (!originMunicipality) {
      throw new Error(`Origin municipality with ID ${data.originMunicipalityId} does not exist`)
    }

    // A) Validate existence of destination municipality
    const destinationMunicipality = await Municipality.find(data.destinationMunicipalityId)
    if (!destinationMunicipality) {
      throw new Error(
        `Destination municipality with ID ${data.destinationMunicipalityId} does not exist`
      )
    }

    // B) Prevent duplicates - check if journey already exists
    const existingJourney = await Journey.query()
      .where('origin_municipality_id', data.originMunicipalityId)
      .where('destination_municipality_id', data.destinationMunicipalityId)
      .first()

    if (existingJourney) {
      throw new Error(
        `Journey from municipality ${data.originMunicipalityId} to ${data.destinationMunicipalityId} already exists`
      )
    }

    // C) Insert cleanly into pivot table
    const journey = await Journey.create(data)

    await journey.load('originMunicipality')
    await journey.load('destinationMunicipality')

    return journey
  }

  /**
   * Assign journey (same as create, but more semantic for N:N relationships)
   * D) Allows multiple assignments
   */
  async assignJourney(data: {
    originMunicipalityId: number
    destinationMunicipalityId: number
    distance?: number
  }): Promise<Journey> {
    return await this.createJourney(data)
  }

  /**
   * Unassign journey (delete the relationship)
   */
  async unassignJourney(
    originMunicipalityId: number,
    destinationMunicipalityId: number
  ): Promise<boolean> {
    const journey = await Journey.query()
      .where('origin_municipality_id', originMunicipalityId)
      .where('destination_municipality_id', destinationMunicipalityId)
      .first()

    if (!journey) {
      return false
    }

    await journey.delete()
    return true
  }

  /**
   * Get all journeys from a specific origin municipality
   */
  async getJourneysByOrigin(originMunicipalityId: number): Promise<Journey[]> {
    return await Journey.query()
      .where('origin_municipality_id', originMunicipalityId)
      .preload('destinationMunicipality')
      .orderBy('id', 'asc')
  }

  /**
   * Get all journeys to a specific destination municipality
   */
  async getJourneysByDestination(destinationMunicipalityId: number): Promise<Journey[]> {
    return await Journey.query()
      .where('destination_municipality_id', destinationMunicipalityId)
      .preload('originMunicipality')
      .orderBy('id', 'asc')
  }

  /**
   * Update journey
   */
  async updateJourney(
    id: number,
    data: {
      originMunicipalityId?: number
      destinationMunicipalityId?: number
      distance?: number
    }
  ): Promise<Journey | null> {
    const journey = await Journey.find(id)

    if (!journey) {
      return null
    }

    // Validate existence if municipalities are being updated
    if (data.originMunicipalityId) {
      const originMunicipality = await Municipality.find(data.originMunicipalityId)
      if (!originMunicipality) {
        throw new Error(`Origin municipality with ID ${data.originMunicipalityId} does not exist`)
      }
    }

    if (data.destinationMunicipalityId) {
      const destinationMunicipality = await Municipality.find(data.destinationMunicipalityId)
      if (!destinationMunicipality) {
        throw new Error(
          `Destination municipality with ID ${data.destinationMunicipalityId} does not exist`
        )
      }
    }

    // Check for duplicates if municipalities are being changed
    if (data.originMunicipalityId || data.destinationMunicipalityId) {
      const newOriginId = data.originMunicipalityId || journey.originMunicipalityId
      const newDestinationId = data.destinationMunicipalityId || journey.destinationMunicipalityId

      const existingJourney = await Journey.query()
        .where('origin_municipality_id', newOriginId)
        .where('destination_municipality_id', newDestinationId)
        .whereNot('id', id)
        .first()

      if (existingJourney) {
        throw new Error(
          `Journey from municipality ${newOriginId} to ${newDestinationId} already exists`
        )
      }
    }

    journey.merge(data)
    await journey.save()

    await journey.load('originMunicipality')
    await journey.load('destinationMunicipality')

    return journey
  }

  /**
   * Delete journey
   */
  async deleteJourney(id: number): Promise<boolean> {
    const journey = await Journey.find(id)

    if (!journey) {
      return false
    }

    await journey.delete()
    return true
  }
}
