import Guide from '#models/tourism/guide'
import SecurityService from '#services/core/security_service'
export default class GuidesService {
  private securityService: SecurityService
  constructor() {
    this.securityService = new SecurityService()
  }
  /**
   * Get all guides with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = Guide.query().preload('touristActivities')
    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }
    return await query
  }
  /**
   * Get a guide by ID
   */
  async findById(id: number) {
    return await Guide.query().where('id', id).preload('touristActivities').firstOrFail()
  }
  /**
   * Create a new guide with an existing user from ms-security
   */
  async create(data: any) {
    if (!data.userId) {
      throw new Error('userId is required to create a guide')
    }
    if (!data.licenseNumber) {
      throw new Error('licenseNumber is required to create a guide')
    }
    try {
      const user = await this.securityService.findById(data.userId)
      if (!user) {
        throw new Error(`User with ID ${data.userId} not found in ms-security`)
      }
      console.log(`Found user in ms-security: ${user.email}`)
      const guideData = {
        UserId: data.userId,
        licenseNumber: data.licenseNumber,
        specialties: data.specialties || null,
        rating: data.rating || 0,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      }
      const guide = await Guide.create(guideData)
      console.log(`Guide created successfully with user ID: ${data.userId}`)
      return guide
    } catch (error: any) {
      console.error('Error creating guide:', error.message)
      throw error
    }
  }
  /**
   * Update a guide
   */
  async update(id: number, data: any) {
    const guide = await Guide.findOrFail(id)
    guide.merge(data)
    await guide.save()
    return guide
  }
  /**
   * Delete a guide
   */
  async delete(id: number) {
    const guide = await Guide.findOrFail(id)
    await guide.delete()
    return guide
  }
}
