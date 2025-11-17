import Client from '#models/core/client'
import SecurityService from './security_service.js'
export default class ClientsService {
  private securityService: SecurityService
  constructor() {
    this.securityService = new SecurityService()
  }
  /**
   * Get all clients with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Client.query().preload('bankCards').preload('tripClients')
    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }
    return await query
  }
  /**
   * Get a client by ID
   */
  async findById(id: number) {
    return await Client.query()
      .where('id', id)
      .preload('bankCards')
      .preload('tripClients')
      .firstOrFail()
  }
  /**
   * Create a new client with an existing user from ms-security
   */
  async create(data: any) {
    if (!data.userId) {
      throw new Error('userId is required to create a client')
    }
    try {
      const user = await this.securityService.findById(data.userId)
      if (!user) {
        throw new Error(`User with ID ${data.userId} not found in ms-security`)
      }
      console.log(`Found user in ms-security: ${user.email}`)
      const clientData = {
        UserId: data.userId,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactPhone: data.emergencyContactPhone || null,
        allergies: data.allergies || null,
        loyaltyPoints: data.loyaltyPoints || 0,
        isVip: data.isVip || false,
      }
      const client = await Client.create(clientData)
      console.log(`Client created successfully with user ID: ${data.userId}`)
      return client
    } catch (error: any) {
      console.error('Error creating client:', error.message)
      throw error
    }
  }
  /**
   * Update a client
   */
  async update(id: number, data: any) {
    const client = await Client.findOrFail(id)
    client.merge(data)
    await client.save()
    return client
  }
  /**
   * Delete a client
   */
  async delete(id: number) {
    const client = await Client.findOrFail(id)
    await client.delete()
    return client
  }
}
