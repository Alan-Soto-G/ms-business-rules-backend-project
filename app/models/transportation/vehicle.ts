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

      // Si el vehículo pasa a estado problemático, buscar servicios activos
      if (problematicStatuses.includes(newStatus)) {
        // Buscar si el vehículo tiene servicios de transporte activos
        await vehicle.load('transportationServices', (query) => {
          query.preload('journey').preload('transportItineraries', (itineraryQuery) => {
            itineraryQuery.preload('trip')
          })
        })

        // Notificar para cada servicio activo
        for (const service of vehicle.transportationServices) {
          // Verificar si el servicio está activo (fecha de inicio <= hoy <= fecha fin)
          const now = DateTime.now()
          const isActive = service.startDate <= now && service.endDate >= now

          if (isActive && service.transportItineraries.length > 0) {
            // Obtener el viaje relacionado (si existe)
            const firstItinerary = service.transportItineraries[0]
            if (firstItinerary.trip) {
              const trip = firstItinerary.trip
              const affectedClients = await getAffectedClientsFromTrip(trip.id)

              // Notificar avería del vehículo
              await notificationService.notifyVehicleBreakdown({
                vehicleId: vehicle.id,
                licensePlate: vehicle.licensePlate,
                vehicleType: vehicle.vehicleType,
                reason: `Vehículo cambió de estado: ${oldStatus} → ${newStatus}`,
                tripId: trip.id,
                tripName: trip.name,
                affectedClients,
              })
            }
          }
        }
      }

      // Siempre notificar el cambio de estado (sin clientes si no hay viajes activos)
      await notificationService.notifyVehicleStatusChanged({
        vehicleId: vehicle.id,
        licensePlate: vehicle.licensePlate,
        oldStatus,
        newStatus,
      })
    }
  }
}
