import type { HttpContext } from '@adonisjs/core/http'
import GpsService from '#services/transportation/gps_service'

export default class GpsController {
  private gpsService: GpsService

  constructor() {
    this.gpsService = new GpsService()
  }

  /**
   * Obtener todos los dispositivos GPS.
   * GET /gps
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const gpsDevices = await this.gpsService.findAll(page, perPage)
      return response.status(200).json(gpsDevices)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Obtener un dispositivo GPS por ID.
   * GET /gps/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const gps = await this.gpsService.findById(params.id)
      return response.status(200).json(gps)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Crear un nuevo dispositivo GPS.
   * POST /gps
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const gps = await this.gpsService.create(data)
      return response.status(201).json(gps)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Actualizar un dispositivo GPS.
   * PUT /gps/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const gps = await this.gpsService.update(params.id, data)
      return response.status(200).json(gps)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Eliminar un dispositivo GPS.
   * DELETE /gps/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const gps = await this.gpsService.delete(params.id)
      return response.status(200).json(gps)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
