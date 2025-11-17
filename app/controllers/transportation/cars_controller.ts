import type { HttpContext } from '@adonisjs/core/http'
import CarsService from '#services/transportation/cars_service'

export default class CarsController {
  private carsService: CarsService

  constructor() {
    this.carsService = new CarsService()
  }

  /**
   * Get all cars
   * GET /cars
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const perPage = request.input('per_page', 10)
      const cars = await this.carsService.findAll(page, perPage)
      return response.status(200).json(cars)
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  /**
   * Get a car by ID
   * GET /cars/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const car = await this.carsService.findById(params.id)
      return response.status(200).json(car)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Create a new car
   * POST /cars
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const car = await this.carsService.create(data)
      return response.status(201).json(car)
    } catch (error) {
      return response.status(400).json({ message: error.message })
    }
  }

  /**
   * Update a car
   * PUT /cars/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.all()
      const car = await this.carsService.update(params.id, data)
      return response.status(200).json(car)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }

  /**
   * Delete a car
   * DELETE /cars/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const car = await this.carsService.delete(params.id)
      return response.status(200).json(car)
    } catch (error) {
      return response.status(404).json({ message: error.message })
    }
  }
}
