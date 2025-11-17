import BankCard from '#models/financial/bank_card'

export default class BankCardsService {
  /**
   * Get all bank cards with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = BankCard.query().preload('client').preload('invoices')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get a bank card by ID
   */
  async findById(id: number) {
    return await BankCard.query()
      .where('id', id)
      .preload('client')
      .preload('invoices')
      .firstOrFail()
  }

  /**
   * Create a new bank card
   */
  async create(data: any) {
    return await BankCard.create(data)
  }

  /**
   * Update a bank card
   */
  async update(id: number, data: any) {
    const bankCard = await BankCard.findOrFail(id)
    bankCard.merge(data)
    await bankCard.save()
    return bankCard
  }

  /**
   * Delete a bank card
   */
  async delete(id: number) {
    const bankCard = await BankCard.findOrFail(id)
    await bankCard.delete()
    return bankCard
  }
}
