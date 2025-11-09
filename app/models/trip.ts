// app/models/trip.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Fee from './fee.js'
import TripClient from './trip_client.js'
import TripPlan from './trip_plan.js'
import TripRoute from './trip_route.js'
import TripRoom from './trip_room.js'

export default class Trip extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare name: string        // Nombre del viaje (ej. "Tour a Medellín")

  @column()
  declare description: string // Descripción corta o resumen

  @column()
  declare price: number       // Precio base o total del viaje

  @column()
  declare capacity: number    // Cupo máximo de personas

  @column()
  declare availableSeats: number // Cupos disponibles (si manejas reservas)

  @column()
  declare status: string      // Estado: 'active', 'cancelled', 'completed', etc.


  @column.dateTime()
  declare startDate: DateTime

  @column.dateTime()
  declare endDate: DateTime

  @column()
  declare destination: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Fee, {
    foreignKey: 'tripId',
  })
  declare fees: HasMany<typeof Fee>

  @hasMany(() => TripClient, {
    foreignKey: 'tripId',
  })
  declare tripClients: HasMany<typeof TripClient>

  @hasMany(() => TripPlan, {
    foreignKey: 'tripId',
  })
  declare tripPlans: HasMany<typeof TripPlan>

  @hasMany(() => TripRoute, {
    foreignKey: 'tripId',
  })
  declare tripRoutes: HasMany<typeof TripRoute>

  @hasMany(() => TripRoom, {
    foreignKey: 'tripId',
  })
  declare tripRooms: HasMany<typeof TripRoom>
}