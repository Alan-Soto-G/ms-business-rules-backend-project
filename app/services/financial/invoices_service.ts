import Invoice from '#models/financial/invoice'

export default class InvoicesService {
  /**
   * Get all invoices with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Invoice.query().preload('fee').preload('bankCard')

    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }

    return await query
  }

  /**
   * Get an invoice by ID
   */
  async findById(id: number) {
    return await Invoice.query().where('id', id).preload('fee').preload('bankCard').firstOrFail()
  }

  /**
   * Create a new invoice
   */
  async create(data: any) {
    return await Invoice.create(data)
  }

  /**
   * Update an invoice
   */
  async update(id: number, data: any) {
    const invoice = await Invoice.findOrFail(id)
    invoice.merge(data)
    await invoice.save()
    return invoice
  }

  /**
   * Delete an invoice
   */
  async delete(id: number) {
    const invoice = await Invoice.findOrFail(id)
    await invoice.delete()
    return invoice
  }
}
