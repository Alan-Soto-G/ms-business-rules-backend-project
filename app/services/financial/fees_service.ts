import Fee from '#models/financial/fee'

// Fees Service
export default class FeesService {
  /**
   * Get all fees with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Fee.query().preload('trip').preload('invoice')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a fee by ID
   */
  async findById(id: number) {
    return await Fee.query().where('id', id).preload('trip').preload('invoice').firstOrFail()
  }

  /**
   * Create a new fee
   */
  async create(data: any) {
    return await Fee.create(data)
  }

  /**
   * Update a fee
   */
  async update(id: number, data: any) {
    const fee = await Fee.findOrFail(id)
    fee.merge(data)
    await fee.save()
    return fee
  }

  /**
   * Delete a fee
   */
  async delete(id: number) {
    const fee = await Fee.findOrFail(id)
    await fee.delete()
    return fee
  }
}
