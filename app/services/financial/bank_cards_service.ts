import BankCard from '#models/financial/bank_card'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

export default class BankCardsService {
  /**
   * Get all bank cards with optional pagination
   */
  async getAllBankCards(
    page?: number,
    limit?: number
  ): Promise<BankCard[] | ModelPaginatorContract<BankCard>> {
    const query = BankCard.query().preload('client').preload('invoices').orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get bank card by ID
   */
  async getBankCardById(id: number): Promise<BankCard | null> {
    return await BankCard.query()
      .where('id', id)
      .preload('client')
      .preload('invoices')
      .first()
  }

  /**
   * Create new bank card
   */
  async createBankCard(data: {
    clientId: number
    cardNumber: string
    cvv: string
    expirationDate: DateTime
    cardHolderName: string
  }): Promise<BankCard> {
    const bankCard = await BankCard.create(data)

    await bankCard.load('client')
    await bankCard.load('invoices')

    return bankCard
  }

  /**
   * Update bank card
   */
  async updateBankCard(
    id: number,
    data: {
      clientId?: number
      cardNumber?: string
      cvv?: string
      expirationDate?: DateTime
      cardHolderName?: string
    }
  ): Promise<BankCard | null> {
    const bankCard = await BankCard.find(id)

    if (!bankCard) {
      return null
    }

    bankCard.merge(data)
    await bankCard.save()

    await bankCard.load('client')
    await bankCard.load('invoices')

    return bankCard
  }

  /**
   * Delete bank card
   */
  async deleteBankCard(id: number): Promise<boolean> {
    const bankCard = await BankCard.find(id)

    if (!bankCard) {
      return false
    }

    await bankCard.delete()
    return true
  }
}