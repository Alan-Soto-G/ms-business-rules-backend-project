import Client from '#models/core/client'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class ClientsService {
  /**
   * Get all clients with optional pagination
   */
  async getAllClients(
    page?: number,
    limit?: number
  ): Promise<Client[] | ModelPaginatorContract<Client>> {
    const query = Client.query()
      .preload('bankCards')
      .preload('tripClients')
      .orderBy('id', 'asc')

    if (page && limit) {
      return await query.paginate(page, limit)
    }

    return await query
  }

  /**
   * Get client by ID
   */
  async getClientById(id: number): Promise<Client | null> {
    return await Client.query()
      .where('id', id)
      .preload('bankCards')
      .preload('tripClients')
      .first()
  }

  /**
   * Create new client
   */
  async createClient(data: {
    userId: string
    emergencyContactName?: string
    emergencyContactPhone?: string
    allergies?: string
    loyaltyPoints?: number
    isVip?: boolean
  }): Promise<Client> {
    const client = await Client.create(data)

    await client.load('bankCards')
    await client.load('tripClients')

    return client
  }

  /**
   * Update client
   */
  async updateClient(
    id: number,
    data: {
      userId?: string
      emergencyContactName?: string
      emergencyContactPhone?: string
      allergies?: string
      loyaltyPoints?: number
      isVip?: boolean
    }
  ): Promise<Client | null> {
    const client = await Client.find(id)

    if (!client) {
      return null
    }

    client.merge(data)
    await client.save()

    await client.load('bankCards')
    await client.load('tripClients')

    return client
  }

  /**
   * Delete client
   */
  async deleteClient(id: number): Promise<boolean> {
    const client = await Client.find(id)

    if (!client) {
      return false
    }

    await client.delete()
    return true
  }
}

