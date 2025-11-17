import Municipality from '#models/core/municipality'

export default class MunicipalitiesService {
  /**
   * Get all municipalities with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Municipality.query()
      .preload('originJourneys')
      .preload('destinationJourneys')
      .preload('hotels')
      .preload('touristActivities')
    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }
    return await query
  }

  /**
   * Get a municipality by ID
   */
  async findById(id: number) {
    return await Municipality.query()
      .where('id', id)
      .preload('originJourneys')
      .preload('destinationJourneys')
      .preload('hotels')
      .preload('touristActivities')
      .firstOrFail()
  }

  /**
   * Create a new municipality
   */
  async create(data: any) {
    // Validar si el código ya existe antes de intentar crear
    if (data.code) {
      const existingMunicipality = await Municipality.query().where('code', data.code).first()
      if (existingMunicipality) {
        throw new Error(`El código '${data.code}' ya está en uso por otro municipio`)
      }
    }

    return await Municipality.create(data)
  }

  /**
   * Update a municipality
   */
  async update(id: number, data: any) {
    const municipality = await Municipality.findOrFail(id)

    // Validar si el código ya existe (excluyendo el municipio actual)
    if (data.code) {
      const existingMunicipality = await Municipality.query()
        .where('code', data.code)
        .whereNot('id', id)
        .first()

      if (existingMunicipality) {
        throw new Error(`El código '${data.code}' ya está en uso por otro municipio`)
      }
    }

    municipality.merge(data)
    await municipality.save()
    return municipality
  }

  /**
   * Delete a municipality
   */
  async delete(id: number) {
    const municipality = await Municipality.findOrFail(id)
    await municipality.delete()
    return municipality
  }
}
