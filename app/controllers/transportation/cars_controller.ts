import type { HttpContext } from '@adonisjs/core/http'
import CarsService from '#services/transportation/cars_service'
import { createCarValidator, updateCarValidator } from '#validators/transportation/car'

export default class CarsController {
  private carsService: CarsService

  constructor() {
    this.carsService = new CarsService()
  }

  /**
   * GET /cars
   * Get all cars with optional pagination
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const limit = request.input('limit')

      const cars = await this.carsService.getAllCars(page, limit)

      return response.ok({
        message: 'Cars retrieved successfully',
        data: cars,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving cars',
        error: error.message,
      })
    }
  }

  /**
   * GET /cars/:id
   * Get car by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const car = await this.carsService.getCarById(params.id)

      if (!car) {
        return response.notFound({
          message: 'Car not found',
        })
      }

      return response.ok({
        message: 'Car retrieved successfully',
        data: car,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error retrieving car',
        error: error.message,
      })
    }
  }

  /**
   * POST /cars
   * Create new car
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createCarValidator)

      const car = await this.carsService.createCar(data)

      return response.created({
        message: 'Car created successfully',
        data: car,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.code === '23505') {
        return response.conflict({
          message: 'License plate already exists',
        })
      }

      if (error.code === '23503') {
        return response.badRequest({
          message: 'Invalid hotel ID or vehicle ID',
        })
      }

      return response.internalServerError({
        message: 'Error creating car',
        error: error.message,
      })
    }
  }

  /**
   * PUT/PATCH /cars/:id
   * Update car
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(updateCarValidator)

      const car = await this.carsService.updateCar(params.id, data)

      if (!car) {
        return response.notFound({
          message: 'Car not found',
        })
      }

      return response.ok({
        message: 'Car updated successfully',
        data: car,
      })
    } catch (error) {
      if (error.messages) {
        return response.badRequest({
          message: 'Validation error',
          errors: error.messages,
        })
      }

      if (error.code === '23505') {
        return response.conflict({
          message: 'License plate already exists',
        })
      }

      if (error.code === '23503') {
        return response.badRequest({
          message: 'Invalid hotel ID',
        })
      }

      return response.internalServerError({
        message: 'Error updating car',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /cars/:id
   * Delete car
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const deleted = await this.carsService.deleteCar(params.id)

      if (!deleted) {
        return response.notFound({
          message: 'Car not found',
        })
      }

      return response.ok({
        message: 'Car deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error deleting car',
        error: error.message,
      })
    }
  }
}
