import Hotel from '#models/accommodation/hotel'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class HotelsService {
  /**
   * Get all hotels with optional pagination
   */
  async getAllHotels(
    page?: number,
    limit?: number
  ): Promise<Hotel[] | ModelPaginatorContract<Hotel>> {
    const query = Hotel.query()
      .preload('hotelAdmin')
      .preload('municipality')
      .preload('rooms')
      .preload('cars')
      .orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get hotel by ID
   */
  async getHotelById(id: number): Promise<Hotel | null> {
    return await Hotel.query()
      .where('id', id)
      .preload('hotelAdmin')
      .preload('municipality')
      .preload('rooms')
      .preload('cars')
      .first()
  }

  /**
   * Create new hotel
   */
  async createHotel(data: {
    hotelAdminId: number
    municipalityId: number
    name: string
    address: string
    phone: string
    email: string
    starRating?: number
    status?: 'active' | 'inactive' | 'under_renovation'
  }): Promise<Hotel> {
    const hotel = await Hotel.create(data)

    await hotel.load('hotelAdmin')
    await hotel.load('municipality')

    return hotel
  }

  /**
   * Update hotel
   */
  async updateHotel(
    id: number,
    data: {
      hotelAdminId?: number
      municipalityId?: number
      name?: string
      address?: string
      phone?: string
      email?: string
      starRating?: number
      status?: 'active' | 'inactive' | 'under_renovation'
    }
  ): Promise<Hotel | null> {
    const hotel = await Hotel.find(id)

    if (!hotel) {
      return null
    }

    hotel.merge(data)
    await hotel.save()

    await hotel.load('hotelAdmin')
    await hotel.load('municipality')
    await hotel.load('rooms')
    await hotel.load('cars')

    return hotel
  }

  /**
   * Delete hotel
   */
  async deleteHotel(id: number): Promise<boolean> {
    const hotel = await Hotel.find(id)

    if (!hotel) {
      return false
    }

    await hotel.delete()
    return true
  }
}
