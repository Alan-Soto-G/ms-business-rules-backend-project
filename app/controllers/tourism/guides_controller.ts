import type { HttpContext } from '@adonisjs/core/http'
import GuidesService from '#services/tourism/guides_service'

export default class GuidesController {
  private guidesService: GuidesService

  constructor() {
    this.guidesService = new GuidesService()
  }

  /**
   * Get all guides
   * GET /guides
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const guides = await this.guidesService.findAll(page, perPage)
      return response.status(200).json(guides)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a guide by ID
   * GET /guides/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const guide = await this.guidesService.findById(params.id)
      return response.status(200).json(guide)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new guide
   * POST /guides
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const guide = await this.guidesService.create(data)
      return response.status(201).json(guide)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a guide
   * PUT /guides/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const guide = await this.guidesService.update(params.id, data)
      return response.status(200).json(guide)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a guide
   * DELETE /guides/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const guide = await this.guidesService.delete(params.id)
      return response.status(200).json(guide)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
