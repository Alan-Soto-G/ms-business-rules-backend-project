import Airline from '#models/transportation/airline'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class AirlinesService {
  /**
   * Get all airlines with optional pagination
   */
  async getAllAirlines(
    page?: number,
    limit?: number
  ): Promise<Airline[] | ModelPaginatorContract<Airline>> {
    const query = Airline.query().orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get airline by ID
   */
  async getAirlineById(id: number): Promise<Airline | null> {
    return await Airline.query().where('id', id).first()
  }

  /**
   * Create new airline
   */
  async createAirline(data: {
    name: string
    codeIata: string
    codeIcao: string
    countryOfOrigin: string
    isActive?: boolean
  }): Promise<Airline> {
    return await Airline.create(data)
  }

  /**
   * Update airline
   */
  async updateAirline(
    id: number,
    data: {
      name?: string
      codeIata?: string
      codeIcao?: string
      countryOfOrigin?: string
      isActive?: boolean
    }
  ): Promise<Airline | null> {
    const airline = await Airline.find(id)

    if (!airline) {
      return null
    }

    airline.merge(data)
    await airline.save()

    return airline
  }

  /**
   * Delete airline
   */
  async deleteAirline(id: number): Promise<boolean> {
    const airline = await Airline.find(id)

    if (!airline) {
      return false
    }

    await airline.delete()
    return true
  }
}
