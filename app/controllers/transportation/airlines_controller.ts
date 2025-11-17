import type { HttpContext } from '@adonisjs/core/http'
import AirlinesService from '#services/transportation/airlines_service'

export default class AirlinesController {
  private airlinesService: AirlinesService

  constructor() {
    this.airlinesService = new AirlinesService()
  }

  /**
   * Obtener todas las aerolíneas
   * GET /airlines
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const airlines = await this.airlinesService.findAll(page, perPage)
      return response.status(200).json(airlines)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Obtener una aerolínea por ID
   * GET /airlines/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const airline = await this.airlinesService.findById(params.id)
      return response.status(200).json(airline)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Crear una nueva aerolínea.
   * POST /airlines
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const airline = await this.airlinesService.create(data)
      return response.status(201).json(airline)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Actualizar una aerolínea existente.
   * PUT /airlines/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const airline = await this.airlinesService.update(params.id, data)
      return response.status(200).json(airline)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Eliminar una aerolínea por id.
   * DELETE /airlines/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const airline = await this.airlinesService.delete(params.id)
      return response.status(200).json(airline)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
