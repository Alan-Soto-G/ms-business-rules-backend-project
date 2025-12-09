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
    const query = Fee.query()
      .preload('tripClient')
      .preload('invoice')
      .orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get fee by ID
   */
  async getFeeById(id: number): Promise<Fee | null> {
    return await Fee.query()
      .where('id', id)
      .preload('tripClient')
      .preload('invoice')
      .first()
  }

  /**
   * Get all installments for a specific user (client)
   */
  async getUserInstallments(clientId: number) {
    const fees = await Fee.query()
      .whereHas('tripClient', (tripClientQuery) => {
        tripClientQuery.where('client_id', clientId)
      })
      .preload('tripClient')
      .preload('invoice')
      .orderBy('due_date', 'asc')

    const paid = fees.filter((fee) => fee.status === 'paid')
    const pending = fees.filter((fee) => fee.status === 'pending')
    const overdue = fees.filter((fee) => fee.status === 'overdue')
    const cancelled = fees.filter((fee) => fee.status === 'cancelled')

    const totalPaid = paid.reduce((sum, fee) => sum + fee.amount, 0)
    const totalPending = pending.reduce((sum, fee) => sum + fee.amount, 0)
    const totalOverdue = overdue.reduce((sum, fee) => sum + fee.amount, 0)

    return {
      totalFees: fees.length,
      paidCount: paid.length,
      pendingCount: pending.count,
      overdueCount: overdue.length,
      totalPaid,
      totalPending,
      totalOverdue,
      paid,
      pending,
      overdue,
      cancelled,
      all: fees,
    }
  }

  /**
   * Get installments by trip client ID
   */
  async getInstallmentsByTripClient(tripClientId: number): Promise<Fee[]> {
    return await Fee.query()
      .where('trip_client_id', tripClientId)
      .preload('tripClient')
      .preload('invoice')
      .orderBy('installment_number', 'asc')
  }

  /**
   * Create new fee
   */
  async createFee(data: {
    tripClientId: number
    installmentNumber: number
    amount: number
    description: string
    dueDate: DateTime
    status?: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded'
  }): Promise<Fee> {
    const fee = await Fee.create(data)

    await fee.load('tripClient')
    await fee.load('invoice')

    return fee
  }

  /**
   * ✅ NUEVO: Create installments for a TripClient after payment
   */
  async createInstallmentsForTripClient(
    tripClientId: number,
    totalAmount: number,
    installments: number
  ): Promise<Fee[]> {
    const amountPerInstallment = totalAmount / installments
    const fees: Fee[] = []

    for (let i = 1; i <= installments; i++) {
      const dueDate = DateTime.now().plus({ months: i - 1 }) // Primera cuota inmediata

      const fee = await Fee.create({
        tripClientId: tripClientId,
        installmentNumber: i,
        amount: amountPerInstallment,
        description: `Cuota ${i} de ${installments}`,
        dueDate: dueDate,
        status: i === 1 ? 'paid' : 'pending', // Primera cuota ya pagada
        
        
      })

      await fee.load('tripClient')
      fees.push(fee)
    }

    console.log(`✅ ${installments} cuotas creadas para TripClient ${tripClientId}`)
    return fees
  }

  /**
   * Update fee
   */
  async updateFee(
    id: number,
    data: {
      tripClientId?: number
      installmentNumber?: number
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

    await fee.load('tripClient')
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