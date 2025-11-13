import type { HttpContext } from '@adonisjs/core/http'
import HotelAdmin from '#models/hotel_admin'
import User from '#models/user'
import { createHotelAdminValidator, updateHotelAdminValidator } from '#validators/hotel_admin'
import { DateTime } from 'luxon'

export default class HotelAdminsController {
  public async findHotelAdmin({ response, request, params }: HttpContext) {
    if (params.id) {
      const theHotelAdmin: HotelAdmin = await HotelAdmin.query()
        .where('id', params.id)
        .preload('user' as any)
        .firstOrFail()
      return response.status(200).json(theHotelAdmin)
    } else {
      const dataHotelAdmins = request.all()
      if ('page' in dataHotelAdmins && 'per_page' in dataHotelAdmins) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const hotelAdmins = await HotelAdmin.query()
          .preload('user' as any)
          .paginate(page, perPage)
        return response.status(200).json(hotelAdmins)
      }

      const allHotelAdmins: HotelAdmin[] = await HotelAdmin.query().preload('user' as any)
      return response.status(200).json(allHotelAdmins)
    }
  }

  public async createHotelAdmin({ request, response }: HttpContext) {
    const data = await request.validateUsing(createHotelAdminValidator)

    // Primero crear el usuario con los datos correspondientes
    const userData: any = {
      idCard: data.idCard,
      email: data.email,
      fullName: data.fullName,
      userType: 'admin' as const,
      status: 'active' as const,
    }

    if (data.phone) userData.phone = data.phone
    if (data.birthDate) userData.birthDate = DateTime.fromJSDate(data.birthDate)
    if (data.address) userData.address = data.address

    const user = await User.create(userData)

    // Luego crear el hotel admin con el userId y los datos específicos
    const hotelAdminData = {
      userId: user.id,
      isVerified: data.isVerified || false,
    }

    const theHotelAdmin = await HotelAdmin.create(hotelAdminData)
    await theHotelAdmin.load('user' as any)

    return response.status(201).json(theHotelAdmin)
  }

  public async updateHotelAdmin({ request, response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Hotel Admin ID not provided' })
    }

    const data = await request.validateUsing(updateHotelAdminValidator)
    const hotelAdmin: HotelAdmin = await HotelAdmin.query()
      .where('id', params.id)
      .preload('user' as any)
      .firstOrFail()

    // Actualizar el usuario si hay datos de usuario
    const userData: any = {}
    if (data.idCard) userData.idCard = data.idCard
    if (data.email) userData.email = data.email
    if (data.fullName) userData.fullName = data.fullName
    if (data.phone !== undefined) userData.phone = data.phone
    if (data.birthDate !== undefined) userData.birthDate = DateTime.fromJSDate(data.birthDate)
    if (data.address !== undefined) userData.address = data.address

    if (Object.keys(userData).length > 0) {
      hotelAdmin.user.merge(userData)
      await hotelAdmin.user.save()
    }

    // Actualizar el hotel admin con datos específicos
    const hotelAdminData: any = {}
    if (data.isVerified !== undefined) hotelAdminData.isVerified = data.isVerified

    if (Object.keys(hotelAdminData).length > 0) {
      hotelAdmin.merge(hotelAdminData)
      await hotelAdmin.save()
    }

    await hotelAdmin.load('user' as any)

    return response.status(200).json(hotelAdmin)
  }

  public async deleteHotelAdmin({ response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Hotel Admin ID not provided' })
    }
    const hotelAdmin: HotelAdmin = await HotelAdmin.query()
      .where('id', params.id)
      .preload('user' as any)
      .firstOrFail()

    // Eliminar el usuario (esto también eliminará el hotel admin por CASCADE)
    await hotelAdmin.user.delete()

    return response.status(200).json({ message: 'Hotel Admin deleted successfully' })
  }
}
