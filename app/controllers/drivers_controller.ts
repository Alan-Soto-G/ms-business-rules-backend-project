import type { HttpContext } from '@adonisjs/core/http'
import Driver from '#models/driver'
import { createDriverValidator, updateDriverValidator } from '#validators/driver'
import axios from 'axios'

const SECURITY_MS_URL = 'http://localhost:8081'

export default class DriversController {
  /**
   * Obtener todos los conductores o uno por ID
   */
  public async findDriver({ response, request, params }: HttpContext) {
    if (params.id) {
      const driver = await Driver.findOrFail(params.id)

      // Obtener información del usuario del MS de seguridad
      try {
        const userResponse = await axios.get(`${SECURITY_MS_URL}/api/users/${driver.userId}`)
        return response.status(200).json({
          ...driver.toJSON(),
          user: userResponse.data,
        })
      } catch (error) {
        return response.status(200).json({
          ...driver.toJSON(),
          user: null,
        })
      }
    } else {
      const dataDrivers = request.all()
      if ('page' in dataDrivers && 'per_page' in dataDrivers) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const drivers = await Driver.query().paginate(page, perPage)
        return response.status(200).json(drivers)
      }

      const allDrivers = await Driver.all()
      return response.status(200).json(allDrivers)
    }
  }

  /**
   * Crear un nuevo conductor
   */
  public async createDriver({ request, response }: HttpContext) {
    const data = await request.validateUsing(createDriverValidator)

    // Verificar que el usuario existe en el MS de seguridad
    try {
      await axios.get(`${SECURITY_MS_URL}/api/users/${data.user_id}`)
    } catch (error) {
      return response.status(404).json({
        message: 'Usuario no encontrado en el sistema de seguridad',
      })
    }

    // Verificar que el user_id no esté ya asignado a otro conductor
    const existingDriver = await Driver.query().where('user_id', data.user_id).first()
    if (existingDriver) {
      return response.status(400).json({
        message: 'Este usuario ya está registrado como conductor',
      })
    }

    const driver = await Driver.create({
      userId: data.user_id,
      experienceYears: data.experience_years,
    })

    return response.status(201).json(driver)
  }

  /**
   * Actualizar un conductor
   */
  public async updateDriver({ request, response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Driver ID not provided' })
    }

    const data = await request.validateUsing(updateDriverValidator)
    const driver = await Driver.findOrFail(params.id)

    // Si se quiere cambiar el user_id, verificar que existe
    if (data.user_id && data.user_id !== driver.userId) {
      try {
        await axios.get(`${SECURITY_MS_URL}/api/users/${data.user_id}`)
      } catch (error) {
        return response.status(404).json({
          message: 'Usuario no encontrado en el sistema de seguridad',
        })
      }

      // Verificar que no esté ya asignado a otro conductor
      const existingDriver = await Driver.query().where('user_id', data.user_id).first()
      if (existingDriver) {
        return response.status(400).json({
          message: 'Este usuario ya está registrado como conductor',
        })
      }

      driver.userId = data.user_id
    }

    if (data.experience_years !== undefined) {
      driver.experienceYears = data.experience_years
    }

    await driver.save()
    return response.status(200).json(driver)
  }

  /**
   * Eliminar un conductor
   */
  public async deleteDriver({ response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Driver ID not provided' })
    }

    const driver = await Driver.findOrFail(params.id)
    await driver.delete()

    return response.status(204).json({})
  }
}
