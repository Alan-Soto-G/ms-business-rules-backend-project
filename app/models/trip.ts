// app/models/trip.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import Fee from './fee.js'
import TripClient from './trip_client.js'
import TripPlan from './trip_plan.js'
import TripRoute from './trip_route.js'
import TripRoom from './trip_room.js'
import Itinerary from './itinerary.js'
import Client from './client.js'
import Room from './room.js'
import Plan from './plan.js'

export default class Trip extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'name' })
  declare name: string // Nombre del viaje (ej. "Tour a Medellín")

  @column({ columnName: 'description' })
  declare description: string // Descripción corta o resumen

  @column({ columnName: 'price' })
  declare price: number // Precio base o total del viaje

  @column({ columnName: 'capacity' })
  declare capacity: number // Cupo máximo de personas

  @column({ columnName: 'available_seats' })
  declare availableSeats: number // Cupos disponibles (si manejas reservas)

  @column({ columnName: 'status' })
  // Estado: 'active', 'cancelled', 'completed', etc.
  declare status: string

  @column.dateTime({ columnName: 'start_date' })
  declare startDate: DateTime

  @column.dateTime({ columnName: 'end_date' })
  declare endDate: DateTime

  @column({ columnName: 'destination' })
  declare destination: string

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
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

  // Relación 1 a 1 con Itinerary
  @hasOne(() => Itinerary, {
    foreignKey: 'tripId',
  })
  declare itinerary: HasOne<typeof Itinerary>

  // Relación N a N con Client a través de trip_clients
  @manyToMany(() => Client, {
    pivotTable: 'trip_clients',
    localKey: 'id',
    pivotForeignKey: 'trip_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'client_id',
  })
  declare clients: ManyToMany<typeof Client>

  // Relación N a N con Room a través de trip_rooms
  @manyToMany(() => Room, {
    pivotTable: 'trip_rooms',
    localKey: 'id',
    pivotForeignKey: 'trip_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'room_id',
  })
  declare rooms: ManyToMany<typeof Room>

  // Relación N a N con Plan a través de trip_plans
  @manyToMany(() => Plan, {
    pivotTable: 'trip_plans',
    localKey: 'id',
    pivotForeignKey: 'trip_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'plan_id',
  })
  declare plans: ManyToMany<typeof Plan>
}
