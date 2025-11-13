import type { HttpContext } from '@adonisjs/core/http'
import Hotel from '#models/hotel'
import { createHotelValidator, updateHotelValidator } from '#validators/hotel'

export default class HotelsController {
  public async findHotel({ response, request, params }: HttpContext) {
    if (params.id) {
      const theHotel: Hotel = await Hotel.query()
        .where('id', params.id)
        .preload('hotelAdmin' as any)
        .firstOrFail()
      return response.status(200).json(theHotel)
    } else {
      const dataHotels = request.all()
      if ('page' in dataHotels && 'per_page' in dataHotels) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const hotels = await Hotel.query()
          .preload('hotelAdmin' as any)
          .paginate(page, perPage)
        return response.status(200).json(hotels)
      }

      const allHotels: Hotel[] = await Hotel.query().preload('hotelAdmin' as any)
      return response.status(200).json(allHotels)
    }
  }

  public async createHotel({ request, response }: HttpContext) {
    const data = await request.validateUsing(createHotelValidator)

    const hotelData = {
      hotelAdminId: data.hotelAdminId,
      municipalityId: data.municipalityId,
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      starRating: data.starRating || 0,
      status: data.status || 'active',
    }

    const theHotel = await Hotel.create(hotelData)
    await theHotel.load('hotelAdmin' as any)

    return response.status(201).json(theHotel)
  }

  public async updateHotel({ request, response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Hotel ID not provided' })
    }

    const data = await request.validateUsing(updateHotelValidator)
    const hotel: Hotel = await Hotel.findOrFail(params.id)

    const hotelData: any = {}
    if (data.hotelAdminId !== undefined) hotelData.hotelAdminId = data.hotelAdminId
    if (data.municipalityId !== undefined) hotelData.municipalityId = data.municipalityId
    if (data.name !== undefined) hotelData.name = data.name
    if (data.address !== undefined) hotelData.address = data.address
    if (data.phone !== undefined) hotelData.phone = data.phone
    if (data.email !== undefined) hotelData.email = data.email
    if (data.starRating !== undefined) hotelData.starRating = data.starRating
    if (data.status !== undefined) hotelData.status = data.status

    if (Object.keys(hotelData).length > 0) {
      hotel.merge(hotelData)
      await hotel.save()
    }

    await hotel.load('hotelAdmin' as any)

    return response.status(200).json(hotel)
  }

  public async deleteHotel({ response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Hotel ID not provided' })
    }
    const hotel: Hotel = await Hotel.findOrFail(params.id)
    await hotel.delete()

    return response.status(200).json({ message: 'Hotel deleted successfully' })
  }
}
