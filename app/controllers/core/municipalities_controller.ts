import type { HttpContext } from '@adonisjs/core/http'
import MunicipalitiesService from '#services/core/municipalities_service'

export default class MunicipalitiesController {
  private municipalitiesService: MunicipalitiesService

  constructor() {
    this.municipalitiesService = new MunicipalitiesService()
  }

  /**
   * Obtener todos los municipios.
   * GET /municipalities
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const municipalities = await this.municipalitiesService.findAll(page, perPage)
      return response.status(200).json(municipalities)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Obtener un municipio por ID.
   * GET /municipalities/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const municipality = await this.municipalitiesService.findById(params.id)
      return response.status(200).json(municipality)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Crear un nuevo municipio.
   * POST /municipalities
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const municipality = await this.municipalitiesService.create(data)
      return response.status(201).json(municipality)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Actualizar un municipio existente.
   * PUT /municipalities/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const municipality = await this.municipalitiesService.update(params.id, data)
      return response.status(200).json(municipality)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Eliminar un municipio por id.
   * DELETE /municipalities/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const municipality = await this.municipalitiesService.delete(params.id)
      return response.status(200).json(municipality)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
