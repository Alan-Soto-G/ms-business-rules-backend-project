import HotelAdmin from '#models/accommodation/hotel_admin'
import SecurityService from '#services/core/security_service'
export default class HotelAdminsService {
  private securityService: SecurityService
  constructor() {
    this.securityService = new SecurityService()
  }
  /**
   * Get all hotel admins with optional pagination
   * @param page - Page number (optional, if not provided returns all records)
   * @param perPage - Items per page (default: 10)
   */
  async findAll(page?: number, perPage: number = 10) {
    const query = HotelAdmin.query().preload('hotels')
    if (page !== undefined) {
      return await query.paginate(page, perPage)
    }
    return await query
  }
  /**
   * Get a hotel admin by ID
   */
  async findById(id: number) {
    return await HotelAdmin.query().where('id', id).preload('hotels').firstOrFail()
  }
  /**
   * Create a new hotel admin with an existing user from ms-security
   */
  async create(data: any) {
    if (!data.userId) {
      throw new Error('userId is required to create a hotel admin')
    }

    // Validar si el userId ya existe (un usuario solo puede ser hotel admin una vez)
    const existingAdmin = await HotelAdmin.query().where('UserId', data.userId).first()
    if (existingAdmin) {
      throw new Error(`El usuario con ID '${data.userId}' ya está registrado como administrador de hotel`)
    }

    try {
      const user = await this.securityService.findById(data.userId)
      if (!user) {
        throw new Error(`User with ID ${data.userId} not found in ms-security`)
      }
      console.log(`Found user in ms-security: ${user.email}`)

      const hotelAdminData = {
        UserId: data.userId,
        isVerified: data.isVerified || false,
      }

      const hotelAdmin = await HotelAdmin.create(hotelAdminData)
      console.log(`Hotel admin created successfully with user ID: ${data.userId}`)
      return hotelAdmin
    } catch (error: any) {
      console.error('Error creating hotel admin:', error.message)
      throw error
    }
  }
  /**
   * Update a hotel admin
   */
  async update(id: number, data: any) {
    const hotelAdmin = await HotelAdmin.findOrFail(id)
    hotelAdmin.merge(data)
    await hotelAdmin.save()
    return hotelAdmin
  }
  /**
   * Delete a hotel admin
   */
  async delete(id: number) {
    const hotelAdmin = await HotelAdmin.findOrFail(id)
    await hotelAdmin.delete()
    return hotelAdmin
  }
}
