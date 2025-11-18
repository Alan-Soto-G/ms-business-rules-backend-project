import HotelAdmin from '#models/accommodation/hotel_admin'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class HotelAdminsService {
  /**
   * Get all hotel admins with optional pagination
   */
  async getAllHotelAdmins(
    page?: number,
    limit?: number
  ): Promise<HotelAdmin[] | ModelPaginatorContract<HotelAdmin>> {
    const query = HotelAdmin.query().preload('hotels').orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get hotel admin by ID
   */
  async getHotelAdminById(id: number): Promise<HotelAdmin | null> {
    return await HotelAdmin.query().where('id', id).preload('hotels').first()
  }

  /**
   * Create new hotel admin
   */
  async createHotelAdmin(data: { userId: string; isVerified?: boolean }): Promise<HotelAdmin> {
    const hotelAdmin = await HotelAdmin.create(data)

    await hotelAdmin.load('hotels')

    return hotelAdmin
  }

  /**
   * Update hotel admin
   */
  async updateHotelAdmin(
    id: number,
    data: { userId?: string; isVerified?: boolean }
  ): Promise<HotelAdmin | null> {
    const hotelAdmin = await HotelAdmin.find(id)

    if (!hotelAdmin) {
      return null
    }

    hotelAdmin.merge(data)
    await hotelAdmin.save()

    await hotelAdmin.load('hotels')

    return hotelAdmin
  }

  /**
   * Delete hotel admin
   */
  async deleteHotelAdmin(id: number): Promise<boolean> {
    const hotelAdmin = await HotelAdmin.find(id)

    if (!hotelAdmin) {
      return false
    }

    await hotelAdmin.delete()
    return true
  }
}
