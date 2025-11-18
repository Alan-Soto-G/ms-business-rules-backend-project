import Fee from '#models/financial/fee'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

export default class FeesService {
  /**
   * Get all fees with optional pagination
   */
  async getAllFees(
    page?: number,
    limit?: number
  ): Promise<Fee[] | ModelPaginatorContract<Fee>> {
    const query = Fee.query().preload('trip').preload('invoice').orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get fee by ID
   */
  async getFeeById(id: number): Promise<Fee | null> {
    return await Fee.query().where('id', id).preload('trip').preload('invoice').first()
  }

  /**
   * Create new fee
   */
  async createFee(data: {
    tripId: number
    amount: number
    description: string
    dueDate: DateTime
    status?: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded'
  }): Promise<Fee> {
    const fee = await Fee.create(data)

    await fee.load('trip')
    await fee.load('invoice')

    return fee
  }

  /**
   * Update fee
   */
  async updateFee(
    id: number,
    data: {
      tripId?: number
      amount?: number
      description?: string
      dueDate?: DateTime
      status?: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded'
    }
  ): Promise<Fee | null> {
    const fee = await Fee.find(id)

    if (!fee) {
      return null
    }

    fee.merge(data)
    await fee.save()

    await fee.load('trip')
    await fee.load('invoice')

    return fee
  }

  /**
   * Delete fee
   */
  async deleteFee(id: number): Promise<boolean> {
    const fee = await Fee.find(id)

    if (!fee) {
      return false
    }

    await fee.delete()
    return true
  }
}
