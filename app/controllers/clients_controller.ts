import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import User from '#models/user'
import { createClientValidator, updateClientValidator } from '#validators/client'
import { DateTime } from 'luxon'

export default class ClientsController {
  public async findClient({ response, request, params }: HttpContext) {
    if (params.id) {
      const theClient: Client = await Client.query()
        .where('id', params.id)
        .preload('user' as any)
        .firstOrFail()
      return response.status(200).json(theClient)
    } else {
      const dataClients = request.all()
      if ('page' in dataClients && 'per_page' in dataClients) {
        const page = request.input('page', 1)
        const perPage = request.input('per_page', 20)
        const clients = await Client.query()
          .preload('user' as any)
          .paginate(page, perPage)
        return response.status(200).json(clients)
      }

      const allClients: Client[] = await Client.query().preload('user' as any)
      return response.status(200).json(allClients)
    }
  }

  public async createClient({ request, response }: HttpContext) {
    const data = await request.validateUsing(createClientValidator)

    // Primero crear el usuario con los datos correspondientes
    const userData: any = {
      idCard: data.idCard,
      email: data.email,
      fullName: data.fullName,
      userType: 'client' as const,
      status: 'active' as const,
    }

    if (data.phone) userData.phone = data.phone
    if (data.birthDate) userData.birthDate = DateTime.fromJSDate(data.birthDate)
    if (data.address) userData.address = data.address

    const user = await User.create(userData)

    // Luego crear el cliente con el userId y los datos específicos
    const clientData = {
      userId: user.id,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      allergies: data.allergies,
      loyaltyPoints: data.loyaltyPoints || 0,
      isVip: data.isVip || false,
    }

    const theClient = await Client.create(clientData)
    await theClient.load('user' as any)

    return response.status(201).json(theClient)
  }

  public async updateClient({ request, response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Client ID not provided' })
    }

    const data = await request.validateUsing(updateClientValidator)
    const client: Client = await Client.query()
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
      client.user.merge(userData)
      await client.user.save()
    }

    // Actualizar el cliente con datos específicos
    const clientData: any = {}
    if (data.emergencyContactName !== undefined)
      clientData.emergencyContactName = data.emergencyContactName
    if (data.emergencyContactPhone !== undefined)
      clientData.emergencyContactPhone = data.emergencyContactPhone
    if (data.allergies !== undefined) clientData.allergies = data.allergies
    if (data.loyaltyPoints !== undefined) clientData.loyaltyPoints = data.loyaltyPoints
    if (data.isVip !== undefined) clientData.isVip = data.isVip

    if (Object.keys(clientData).length > 0) {
      client.merge(clientData)
      await client.save()
    }

    await client.load('user' as any)

    return response.status(200).json(client)
  }

  public async deleteClient({ response, params }: HttpContext) {
    if (!params.id) {
      return response.status(400).json({ message: 'Client ID not provided' })
    }
    const client: Client = await Client.query()
      .where('id', params.id)
      .preload('user' as any)
      .firstOrFail()

    // Eliminar el usuario (esto también eliminará el cliente por CASCADE)
    await client.user.delete()

    return response.status(200).json({ message: 'Client deleted successfully' })
  }
}
