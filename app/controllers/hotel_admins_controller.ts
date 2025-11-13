import type { HttpContext } from '@adonisjs/core/http'
import HotelAdmin from '#models/hotel_admin'
import { createHotelAdminValidator, updateHotelAdminValidator } from '#validators/hotel_admin'
import axios from 'axios'

const SECURITY_MS_URL = 'http://localhost:8081'

export default class HotelAdminsController {
  public async findHotelAdmin({ response, request, params }: HttpContext) {
    if (params.id) {
      const theHotelAdmin = await HotelAdmin.findOrFail(params.id)

      // Obtener información del usuario del MS de seguridad
      try {
        const userResponse = await axios.get(`${SECURITY_MS_URL}/api/users/${theHotelAdmin.userId}`)
        return response.status(200).json({
          ...theHotelAdmin.toJSON(),
          user: userResponse.data,
        })
      } catch (error) {
        return response.status(200).json({
          ...theHotelAdmin.toJSON(),
          user: null,
        })
      }
    } else {
      const dataHotelAdmins = request.all()
      if ('page' in dataHotelAdmins && 'per_page' in dataHotelAdmins) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const hotelAdmins = await HotelAdmin.query().paginate(page, perPage)
        return response.status(200).json(hotelAdmins)
      }

      const allHotelAdmins = await HotelAdmin.all()
      return response.status(200).json(allHotelAdmins)
    }
  }

  public async createHotelAdmin({ request, response }: HttpContext) {
    const data = await request.validateUsing(createHotelAdminValidator)

    // El usuario debe existir en el MS de seguridad (debe ser creado allí previamente)
    const hotelAdminData = {
      userId: data.user_id,
      isVerified: data.isVerified || false,
    }

    const theHotelAdmin = await HotelAdmin.create(hotelAdminData)

    return response.status(201).json(theHotelAdmin)
  }

  public async updateHotelAdmin({ request, response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Hotel Admin ID not provided' })
    }

    const data = await request.validateUsing(updateHotelAdminValidator)
    const hotelAdmin = await HotelAdmin.findOrFail(params.id)

    // Solo actualizamos datos específicos del hotel admin
    if (data.isVerified !== undefined) hotelAdmin.isVerified = data.isVerified

    await hotelAdmin.save()

    return response.status(200).json(hotelAdmin)
  }

  public async deleteHotelAdmin({ response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Hotel Admin ID not provided' })
    }

    const hotelAdmin = await HotelAdmin.findOrFail(params.id)
    await hotelAdmin.delete()

    return response.status(200).json({ message: 'Hotel Admin deleted successfully' })
  }
}
