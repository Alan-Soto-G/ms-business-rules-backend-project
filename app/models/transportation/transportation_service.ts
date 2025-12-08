import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, beforeUpdate } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { Journey, Vehicle, TransportItinerary } from './index.js'
import notificationService from '#services/notification_service'
import { getAffectedClientsFromTrip } from '#services/helpers/notification_helpers'

export default class TransportationService extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Foreign keys
  @column({ columnName: 'journey_id' })
  declare journeyId: number

  @column({ columnName: 'vehicle_id' })
  declare vehicleId: number

  // Specific attributes of Transportation Service
  @column({ columnName: 'start_date' })
  declare startDate: DateTime

  @column({ columnName: 'end_date' })
  declare endDate: DateTime

  @column({ columnName: 'cost' })
  declare cost: number

  // Relation N to 1 with Journey
  @belongsTo(() => Journey, {
    foreignKey: 'journeyId',
  })
  declare journey: BelongsTo<typeof Journey>

  // Relation N to 1 with Vehicle
  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
  })
  declare vehicle: BelongsTo<typeof Vehicle>

  // Relation 1 to N with Transport Itinerary
  @hasMany(() => TransportItinerary, {
    foreignKey: 'transportationServiceId',
  })
  declare transportItineraries: HasMany<typeof TransportItinerary>

  // Timestamps
  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  /**
   * Hook: Detecta cuando se cambia el vehículo de un servicio activo
   */
  @beforeUpdate()
  static async notifyVehicleReplacement(service: TransportationService) {
    // Solo notificar si cambió el vehículo
    if (service.$dirty.vehicleId) {
      const oldVehicleId = service.$original.vehicleId
      const newVehicleId = service.vehicleId

      // Verificar si el servicio está activo
      const now = DateTime.now()
      const isActive = service.startDate <= now && service.endDate >= now

      if (isActive) {
        console.log(`🔄 Reemplazo de vehículo detectado en servicio ${service.id}`)

        // Cargar vehículos e itinerarios
        await service.load('vehicle')
        const newVehicle = service.vehicle

        // Cargar el vehículo anterior
        const oldVehicle = await Vehicle.find(oldVehicleId)

        // Cargar itinerarios y viajes
        await service.load('transportItineraries', (query) => {
          query.preload('trip')
        })

        if (service.transportItineraries.length > 0) {
          const firstItinerary = service.transportItineraries[0]
          if (firstItinerary.trip) {
            const trip = firstItinerary.trip
            const affectedClients = await getAffectedClientsFromTrip(trip.id)

            console.log('🚗 Vehículo reemplazado:')
            console.log(`   Anterior: ${oldVehicle?.licensePlate} (${oldVehicle?.vehicleType})`)
            console.log(`   Nuevo: ${newVehicle.licensePlate} (${newVehicle.vehicleType})`)
            console.log(
              '📧 Emails:',
              affectedClients.map((c) => c.email)
            )

            // Notificar reemplazo de vehículo
            await notificationService.notifyVehicleReplaced({
              oldVehicleId,
              oldLicensePlate: oldVehicle?.licensePlate || 'Desconocido',
              oldVehicleType: oldVehicle?.vehicleType || 'Desconocido',
              newVehicleId,
              newLicensePlate: newVehicle.licensePlate,
              newVehicleType: newVehicle.vehicleType,
              reason: 'Vehículo reemplazado en servicio de transporte',
              tripId: trip.id,
              tripName: trip.name,
              affectedClients,
            })
          }
        }
      }
    }
  }
}
