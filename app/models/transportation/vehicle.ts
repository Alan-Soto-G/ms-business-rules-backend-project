import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, hasMany, beforeUpdate } from '@adonisjs/lucid/orm'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import Aircraft from '#models/transportation/aircraft'
import Gps from '#models/transportation/gps'
import Car from '#models/transportation/car'
import TransportationService from '#models/transportation/transportation_service'
import notificationService from '#services/notification_service'
import { getAffectedClientsFromTrip } from '#services/helpers/notification_helpers'

export default class Vehicle extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Specific attributes of Vehicle
  @column({ columnName: 'license_plate' })
  declare licensePlate: string

  @column({ columnName: 'brand' })
  declare brand: string

  @column({ columnName: 'model' })
  declare model: string

  @column({ columnName: 'year' })
  declare year: number

  @column({ columnName: 'color' })
  declare color: string

  @column({ columnName: 'number_of_seats' })
  declare numberOfSeats: number

  @column({ columnName: 'vehicle_type' })
  declare vehicleType: string

  @column({ columnName: 'status' })
  declare status: string

  // Relación 1 a 1 con Aircraft
  @hasOne(() => Aircraft, {
    foreignKey: 'vehicleId',
  })
  declare aircraft: HasOne<typeof Aircraft>

  // Relación 1 a 1 con GPS
  @hasOne(() => Gps, {
    foreignKey: 'vehicleId',
  })
  declare gps: HasOne<typeof Gps>

  // Relación 1 a 1 con Car
  @hasOne(() => Car, {
    foreignKey: 'vehicleId',
  })
  declare car: HasOne<typeof Car>

  // Relation 1 to N with Transportation Service
  @hasMany(() => TransportationService, {
    foreignKey: 'vehicleId',
  })
  declare transportationServices: HasMany<typeof TransportationService>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  /**
   * Hook: Detecta cambios de estado del vehículo y emite notificaciones
   */
  @beforeUpdate()
  static async notifyVehicleStatusChange(vehicle: Vehicle) {
    // Solo notificar si el estado cambió
    if (vehicle.$dirty.status) {
      const oldStatus = vehicle.$original.status
      const newStatus = vehicle.status

      // Estados que indican problema según el validador: maintenance, retired
      const problematicStatuses = ['maintenance', 'retired']

      // Bandera para saber si ya se envió un evento específico
      let specificEventSent = false

      // Caso 1: Vehículo pasa a estado problemático (maintenance, retired)
      if (problematicStatuses.includes(newStatus)) {
        console.log(`🔍 Vehículo ${vehicle.licensePlate} cambió a ${newStatus}`)

        // Buscar si el vehículo tiene servicios de transporte activos
        await vehicle.load('transportationServices', (query) => {
          query.preload('journey').preload('transportItineraries', (itineraryQuery) => {
            itineraryQuery.preload('trip')
          })
        })

        console.log(
          `📦 Servicios de transporte encontrados: ${vehicle.transportationServices.length}`
        )

        // Notificar para cada servicio activo
        for (const service of vehicle.transportationServices) {
          // Verificar si el servicio está activo (fecha de inicio <= hoy <= fecha fin)
          const now = DateTime.now()
          const isActive = service.startDate <= now && service.endDate >= now

          console.log(
            `⏰ Servicio ${service.id}: activo=${isActive}, itinerarios=${service.transportItineraries.length}`
          )

          if (isActive && service.transportItineraries.length > 0) {
            // Obtener el viaje relacionado (si existe)
            const firstItinerary = service.transportItineraries[0]
            console.log(`🗺️ Primer itinerario tiene viaje: ${!!firstItinerary.trip}`)

            if (firstItinerary.trip) {
              const trip = firstItinerary.trip
              const affectedClients = await getAffectedClientsFromTrip(trip.id)

              console.log('🚨 Alerta de vehículo detectada:')
              console.log(
                '📧 Emails a notificar:',
                affectedClients.map((c) => c.email)
              )
              console.log('🚗 Vehículo:', vehicle.licensePlate)
              console.log('📊 Total clientes:', affectedClients.length)

              // Notificar avería del vehículo (evento específico)
              await notificationService.notifyVehicleBreakdown({
                vehicleId: vehicle.id,
                licensePlate: vehicle.licensePlate,
                vehicleType: vehicle.vehicleType,
                reason: `Vehículo cambió de estado: ${oldStatus} → ${newStatus}`,
                tripId: trip.id,
                tripName: trip.name,
                affectedClients,
              })
              specificEventSent = true // Marcamos que ya se envió evento específico
            }
          }
        }
      }

      // Caso 2: Vehículo sale de estado problemático → vuelve a estar disponible
      if (problematicStatuses.includes(oldStatus) && newStatus === 'available') {
        console.log(`✅ Vehículo ${vehicle.licensePlate} reparado: ${oldStatus} → ${newStatus}`)

        // Buscar servicios activos que estaban afectados
        await vehicle.load('transportationServices', (query) => {
          query.preload('journey').preload('transportItineraries', (itineraryQuery) => {
            itineraryQuery.preload('trip')
          })
        })

        for (const service of vehicle.transportationServices) {
          const now = DateTime.now()
          const isActive = service.startDate <= now && service.endDate >= now

          if (isActive && service.transportItineraries.length > 0) {
            const firstItinerary = service.transportItineraries[0]
            if (firstItinerary.trip) {
              const trip = firstItinerary.trip
              const affectedClients = await getAffectedClientsFromTrip(trip.id)

              console.log('✅ Vehículo reparado - notificando clientes:')
              console.log(
                '📧 Emails:',
                affectedClients.map((c) => c.email)
              )

              // Notificar que el vehículo fue reparado
              await notificationService.notifyVehicleRepaired({
                vehicleId: vehicle.id,
                licensePlate: vehicle.licensePlate,
                vehicleType: vehicle.vehicleType,
                tripId: trip.id,
                tripName: trip.name,
                affectedClients,
              })
              specificEventSent = true
            }
          }
        }
      }

      // Solo enviar cambio de estado genérico si NO se envió evento específico
      if (!specificEventSent) {
        await notificationService.notifyVehicleStatusChanged({
          vehicleId: vehicle.id,
          licensePlate: vehicle.licensePlate,
          oldStatus,
          newStatus,
        })
      }
    }
  }
}
