import type { HttpContext } from '@adonisjs/core/http'
import Guide from '#models/guide'
import User from '#models/user'
import { createGuideValidator, updateGuideValidator } from '#validators/guide'
import { DateTime } from 'luxon'

export default class GuidesController {
  public async findGuide({ response, request, params }: HttpContext) {
    if (params.id) {
      const theGuide: Guide = await Guide.query()
        .where('id', params.id)
        .preload('user' as any)
        .firstOrFail()
      return response.status(200).json(theGuide)
    } else {
      const dataGuides = request.all()
      if ('page' in dataGuides && 'per_page' in dataGuides) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const guides = await Guide.query()
          .preload('user' as any)
          .paginate(page, perPage)
        return response.status(200).json(guides)
      }

      const allGuides: Guide[] = await Guide.query().preload('user' as any)
      return response.status(200).json(allGuides)
    }
  }

  public async createGuide({ request, response }: HttpContext) {
    const data = await request.validateUsing(createGuideValidator)

    // Primero crear el usuario con los datos correspondientes
    const userData: any = {
      idCard: data.idCard,
      email: data.email,
      fullName: data.fullName,
      userType: 'guide' as const,
      status: 'active' as const,
    }

    if (data.phone) userData.phone = data.phone
    if (data.birthDate) userData.birthDate = DateTime.fromJSDate(data.birthDate)
    if (data.address) userData.address = data.address

    const user = await User.create(userData)

    // Luego crear el guía con el userId y los datos específicos
    const guideData = {
      userId: user.id,
      licenseNumber: data.licenseNumber,
      specialties: data.specialties,
      rating: data.rating || 0,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    }

    const theGuide = await Guide.create(guideData)
    await theGuide.load('user' as any)

    return response.status(201).json(theGuide)
  }

  public async updateGuide({ request, response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Guide ID not provided' })
    }

    const data = await request.validateUsing(updateGuideValidator)
    const guide: Guide = await Guide.query()
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
      guide.user.merge(userData)
      await guide.user.save()
    }

    // Actualizar el guía con datos específicos
    const guideData: any = {}
    if (data.licenseNumber !== undefined) guideData.licenseNumber = data.licenseNumber
    if (data.specialties !== undefined) guideData.specialties = data.specialties
    if (data.rating !== undefined) guideData.rating = data.rating
    if (data.isAvailable !== undefined) guideData.isAvailable = data.isAvailable

    if (Object.keys(guideData).length > 0) {
      guide.merge(guideData)
      await guide.save()
    }

    await guide.load('user' as any)

    return response.status(200).json(guide)
  }

  public async deleteGuide({ response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Guide ID not provided' })
    }
    const guide: Guide = await Guide.query()
      .where('id', params.id)
      .preload('user' as any)
      .firstOrFail()

    // Eliminar el usuario (esto también eliminará el guía por CASCADE)
    await guide.user.delete()

    return response.status(200).json({ message: 'Guide deleted successfully' })
  }
}
