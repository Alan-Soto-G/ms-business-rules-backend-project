import Hotel from '#models/accommodation/hotel'

export default class HotelsService {
  /**
   * Get all hotels
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Hotel.query()
      .preload('hotelAdmin')
      .preload('municipality')
      .preload('rooms')
      .preload('cars')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a hotel by ID
   */
  async findById(id: number) {
    return await Hotel.query()
      .where('id', id)
      .preload('hotelAdmin')
      .preload('municipality')
      .preload('rooms')
      .preload('cars')
      .firstOrFail()
  }

  /**
   * Create a new hotel
   */
  async create(data: any) {
    return await Hotel.create(data)
  }

  /**
   * Update a hotel
   */
  async update(id: number, data: any) {
    const hotel = await Hotel.findOrFail(id)
    hotel.merge(data)
    await hotel.save()
    return hotel
  }

  /**
   * Delete a hotel
   */
  async delete(id: number) {
    const hotel = await Hotel.findOrFail(id)
    await hotel.delete()
    return hotel
  }
}
