import type { HttpContext } from '@adonisjs/core/http'
import HotelAdminsService from '#services/accommodation/hotel_admins_service'

export default class HotelAdminsController {
  private hotelAdminsService: HotelAdminsService

  constructor() {
    this.hotelAdminsService = new HotelAdminsService()
  }

  /**
   * Get all hotel admins
   * GET /hotel-admins
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const hotelAdmins = await this.hotelAdminsService.findAll(page, perPage)
      return response.status(200).json(hotelAdmins)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a hotel admin by ID
   * GET /hotel-admins/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const hotelAdmin = await this.hotelAdminsService.findById(params.id)
      return response.status(200).json(hotelAdmin)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new hotel admin
   * POST /hotel-admins
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const hotelAdmin = await this.hotelAdminsService.create(data)
      return response.status(201).json(hotelAdmin)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a hotel admin
   * PUT /hotel-admins/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const hotelAdmin = await this.hotelAdminsService.update(params.id, data)
      return response.status(200).json(hotelAdmin)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a hotel admin
   * DELETE /hotel-admins/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const hotelAdmin = await this.hotelAdminsService.delete(params.id)
      return response.status(200).json(hotelAdmin)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
