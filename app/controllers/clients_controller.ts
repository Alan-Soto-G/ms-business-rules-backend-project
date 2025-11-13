import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import { createClientValidator, updateClientValidator } from '#validators/client'
import axios from 'axios'

const SECURITY_MS_URL = 'http://localhost:8081'

export default class ClientsController {
  public async findClient({ response, request, params }: HttpContext) {
    if (params.id) {
      const theClient = await Client.findOrFail(params.id)

      // Obtener información del usuario del MS de seguridad
      try {
        const userResponse = await axios.get(`${SECURITY_MS_URL}/api/users/${theClient.userId}`)
        return response.status(200).json({
          ...theClient.toJSON(),
          user: userResponse.data,
        })
      } catch (error) {
        return response.status(200).json({
          ...theClient.toJSON(),
          user: null,
        })
      }
    } else {
      const dataClients = request.all()
      if ('page' in dataClients && 'per_page' in dataClients) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const clients = await Client.query().paginate(page, perPage)
        return response.status(200).json(clients)
      }

      const allClients = await Client.all()
      return response.status(200).json(allClients)
    }
  }

  public async createClient({ request, response }: HttpContext) {
    const data = await request.validateUsing(createClientValidator)

    // El usuario debe existir en el MS de seguridad (debe ser creado allí previamente)
    const clientData = {
      userId: data.user_id,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      allergies: data.allergies,
      loyaltyPoints: data.loyaltyPoints || 0,
      isVip: data.isVip || false,
    }

    const theClient = await Client.create(clientData)

    return response.status(201).json(theClient)
  }

  public async updateClient({ request, response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Client ID not provided' })
    }

    const data = await request.validateUsing(updateClientValidator)
    const client = await Client.findOrFail(params.id)

    // Solo actualizamos datos específicos del cliente
    if (data.emergencyContactName !== undefined)
      client.emergencyContactName = data.emergencyContactName
    if (data.emergencyContactPhone !== undefined)
      client.emergencyContactPhone = data.emergencyContactPhone
    if (data.allergies !== undefined) client.allergies = data.allergies
    if (data.loyaltyPoints !== undefined) client.loyaltyPoints = data.loyaltyPoints
    if (data.isVip !== undefined) client.isVip = data.isVip

    await client.save()

    return response.status(200).json(client)
  }

  public async deleteClient({ response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Client ID not provided' })
    }

    const client = await Client.findOrFail(params.id)
    await client.delete()

    return response.status(200).json({ message: 'Client deleted successfully' })
  }
}
