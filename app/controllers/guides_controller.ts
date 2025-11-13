import type { HttpContext } from '@adonisjs/core/http'
import Guide from '#models/guide'
import { createGuideValidator, updateGuideValidator } from '#validators/guide'
import axios from 'axios'

const SECURITY_MS_URL = 'http://localhost:8081'

export default class GuidesController {
  public async findGuide({ response, request, params }: HttpContext) {
    if (params.id) {
      const theGuide = await Guide.findOrFail(params.id)

      // Obtener información del usuario del MS de seguridad
      try {
        const userResponse = await axios.get(`${SECURITY_MS_URL}/api/users/${theGuide.userId}`)
        return response.status(200).json({
          ...theGuide.toJSON(),
          user: userResponse.data,
        })
      } catch (error) {
        return response.status(200).json({
          ...theGuide.toJSON(),
          user: null,
        })
      }
    } else {
      const dataGuides = request.all()
      if ('page' in dataGuides && 'per_page' in dataGuides) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const guides = await Guide.query().paginate(page, perPage)
        return response.status(200).json(guides)
      }

      const allGuides = await Guide.all()
      return response.status(200).json(allGuides)
    }
  }

  public async createGuide({ request, response }: HttpContext) {
    const data = await request.validateUsing(createGuideValidator)

    // El usuario debe existir en el MS de seguridad (debe ser creado allí previamente)
    // Solo creamos el Guide con el user_id
    const guideData = {
      userId: data.user_id,
      licenseNumber: data.licenseNumber,
      specialties: data.specialties,
      rating: data.rating || 0,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    }

    const theGuide = await Guide.create(guideData)

    return response.status(201).json(theGuide)
  }

  public async updateGuide({ request, response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Guide ID not provided' })
    }

    const data = await request.validateUsing(updateGuideValidator)
    const guide = await Guide.findOrFail(params.id)

    // Solo actualizamos datos específicos del guía
    if (data.licenseNumber !== undefined) guide.licenseNumber = data.licenseNumber
    if (data.specialties !== undefined) guide.specialties = data.specialties
    if (data.rating !== undefined) guide.rating = data.rating
    if (data.isAvailable !== undefined) guide.isAvailable = data.isAvailable

    await guide.save()

    return response.status(200).json(guide)
  }

  public async deleteGuide({ response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Guide ID not provided' })
    }

    const guide = await Guide.findOrFail(params.id)
    await guide.delete()

    return response.status(200).json({ message: 'Guide deleted successfully' })
  }
}
