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
    // Validar si el teléfono ya existe antes de intentar crear
    if (data.phone) {
      const existingByPhone = await Hotel.query()
        .where('phone', data.phone)
        .first()
      if (existingByPhone) {
        throw new Error(`El teléfono '${data.phone}' ya está en uso por otro hotel`)
      }
    }

    // Validar si el email ya existe antes de intentar crear
    if (data.email) {
      const existingByEmail = await Hotel.query()
        .where('email', data.email)
        .first()
      if (existingByEmail) {
        throw new Error(`El email '${data.email}' ya está en uso por otro hotel`)
      }
    }

    return await Hotel.create(data)
  }

  /**
   * Update a hotel
   */
  async update(id: number, data: any) {
    const hotel = await Hotel.findOrFail(id)

    // Validar si el teléfono ya existe (excluyendo el hotel actual)
    if (data.phone) {
      const existingByPhone = await Hotel.query()
        .where('phone', data.phone)
        .whereNot('id', id)
        .first()
      if (existingByPhone) {
        throw new Error(`El teléfono '${data.phone}' ya está en uso por otro hotel`)
      }
    }

    // Validar si el email ya existe (excluyendo el hotel actual)
    if (data.email) {
      const existingByEmail = await Hotel.query()
        .where('email', data.email)
        .whereNot('id', id)
        .first()
      if (existingByEmail) {
        throw new Error(`El email '${data.email}' ya está en uso por otro hotel`)
      }
    }

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
