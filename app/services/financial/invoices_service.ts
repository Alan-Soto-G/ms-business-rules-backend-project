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
    // Validar si el invoiceNumber ya existe antes de intentar crear
    if (data.invoiceNumber) {
      const existingByNumber = await Invoice.query()
        .where('invoiceNumber', data.invoiceNumber)
        .first()
      if (existingByNumber) {
        throw new Error(`El número de factura '${data.invoiceNumber}' ya está en uso`)
      }
    }

    // Validar si el feeId ya existe (una cuota solo puede tener una factura)
    if (data.feeId) {
      const existingByFee = await Invoice.query()
        .where('feeId', data.feeId)
        .first()
      if (existingByFee) {
        throw new Error(`La cuota con ID '${data.feeId}' ya tiene una factura asociada`)
      }
    }

    return await Invoice.create(data)
  }

  /**
   * Update an invoice
   */
  async update(id: number, data: any) {
    const invoice = await Invoice.findOrFail(id)

    // Validar si el invoiceNumber ya existe (excluyendo la factura actual)
    if (data.invoiceNumber) {
      const existingByNumber = await Invoice.query()
        .where('invoiceNumber', data.invoiceNumber)
        .whereNot('id', id)
        .first()
      if (existingByNumber) {
        throw new Error(`El número de factura '${data.invoiceNumber}' ya está en uso`)
      }
    }

    // Validar si el feeId ya existe (excluyendo la factura actual)
    if (data.feeId) {
      const existingByFee = await Invoice.query()
        .where('feeId', data.feeId)
        .whereNot('id', id)
        .first()
      if (existingByFee) {
        throw new Error(`La cuota con ID '${data.feeId}' ya tiene una factura asociada`)
      }
    }

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
