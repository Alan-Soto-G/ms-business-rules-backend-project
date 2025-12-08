/**
 * Servicio de Notificaciones
 *
 * Comunica eventos del microservicio de Negocio al microservicio de Notificaciones (Python)
 * usando arquitectura basada en eventos (Event-Driven)
 */

import axios, { AxiosInstance } from 'axios'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

export interface EventPayload {
  eventType: string
  payload: Record<string, any>
  timestamp?: string
}

export class NotificationService {
  private client: AxiosInstance
  private enabled: boolean

  constructor() {
    // URL del microservicio de notificaciones
    const notificationServiceUrl = env.get('MS_NOTIFICATIONS', 'http://localhost:5000')

    this.client = axios.create({
      baseURL: notificationServiceUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Siempre habilitado para que funcione con la configuración del equipo
    this.enabled = true
  }

  /**
   * Emite un evento al microservicio de notificaciones
   */
  async emit(eventType: string, payload: Record<string, any>): Promise<void> {
    if (!this.enabled) {
      logger.debug(`[Notifications Disabled] Event: ${eventType}`)
      return
    }

    const event: EventPayload = {
      eventType: eventType,
      payload: payload,
      timestamp: new Date().toISOString(),
    }

    try {
      await this.client.post('/event', event)
      logger.info(`[Notification Event Sent] ${eventType}`, { event })
    } catch (error) {
      logger.error(`[Notification Error] Failed to send event: ${eventType}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        payload,
      })
      // No lanzamos el error para que no afecte la operación principal del negocio
    }
  }

  /**
   * ===========================
   * ANOMALÍAS EN ITINERARIO
   * ===========================
   */

  /**
   * Notifica un retraso en un tramo del itinerario (vuelo, transporte terrestre, etc.)
   */
  async notifyItinerarySegmentDelayed(data: {
    tripId: number
    tripName: string
    segmentId: number
    segmentType: string
    delayMinutes: number
    reason?: string
    affectedClients: Array<{ name: string; email: string; phone?: string }>
  }): Promise<void> {
    await this.emit('itinerary.segment.delayed', data)
  }

  /**
   * Notifica retraso de vuelo
   */
  async notifyFlightDelayed(data: {
    flightNumber: string
    delayMinutes: number
    reason: string
    tripId?: number
    tripName?: string
    affectedClients: Array<{ name: string; email: string; phone?: string }>
  }): Promise<void> {
    await this.emit('flight.delayed', data)
  }

  /**
   * Notifica avería de vehículo asignado a un servicio activo
   */
  async notifyVehicleBreakdown(data: {
    vehicleId: number
    licensePlate: string
    vehicleType: string
    reason: string
    tripId?: number
    tripName?: string
    affectedClients: Array<{ name: string; email: string; phone?: string }>
  }): Promise<void> {
    await this.emit('vehicle.breakdown', data)
  }

  /**
   * Notifica cambio de estado de vehículo (ej: de disponible a en reparación)
   */
  async notifyVehicleStatusChanged(data: {
    vehicleId: number
    licensePlate: string
    oldStatus: string
    newStatus: string
    tripId?: number
    tripName?: string
    affectedClients?: Array<{ name: string; email: string; phone?: string }>
  }): Promise<void> {
    await this.emit('vehicle.status.changed', data)
  }

  /**
   * Notifica cuando un vehículo ha sido reparado y vuelve a estar disponible
   */
  async notifyVehicleRepaired(data: {
    vehicleId: number
    licensePlate: string
    vehicleType: string
    tripId: number
    tripName: string
    affectedClients: Array<{ name: string; email: string; phone?: string }>
  }): Promise<void> {
    await this.emit('vehicle.repaired', data)
  }

  /**
   * Notifica cuando se reemplaza un vehículo en un servicio activo
   */
  async notifyVehicleReplaced(data: {
    oldVehicleId: number
    oldLicensePlate: string
    oldVehicleType: string
    newVehicleId: number
    newLicensePlate: string
    newVehicleType: string
    reason: string
    tripId: number
    tripName: string
    affectedClients: Array<{ name: string; email: string; phone?: string }>
  }): Promise<void> {
    await this.emit('vehicle.replaced', data)
  }

  /**
   * ===========================
   * CANCELACIONES
   * ===========================
   */

  /**
   * Notifica cancelación de actividad turística
   */
  async notifyActivityCancelled(data: {
    activityId: number
    activityName: string
    reason: string
    tripId?: number
    tripName?: string
    affectedClients: Array<{ name: string; email: string; phone?: string }>
  }): Promise<void> {
    await this.emit('activity.cancelled', data)
  }

  /**
   * Notifica cancelación de viaje completo
   */
  async notifyTripCancelled(data: {
    tripId: number
    tripName: string
    reason: string
    affectedClients: Array<{ name: string; email: string; phone?: string }>
  }): Promise<void> {
    await this.emit('trip.cancelled', data)
  }

  /**
   * ===========================
   * CONFIRMACIONES
   * ===========================
   */

  /**
   * Notifica confirmación de pago aceptado
   */
  async notifyPaymentAccepted(data: {
    invoiceId: number
    invoiceNumber: string
    amount: number
    paymentMethod: string
    clientName: string
    clientEmail: string
    tripId: number
    tripName: string
  }): Promise<void> {
    await this.emit('payment.accepted', data)
  }

  /**
   * Notifica confirmación de reserva
   */
  async notifyBookingConfirmed(data: {
    bookingId: number
    hotelName: string
    roomType: string
    checkInDate: string
    checkOutDate: string
    clientName: string
    clientEmail: string
    tripId?: number
    tripName?: string
  }): Promise<void> {
    await this.emit('booking.confirmed', data)
  }

  /**
   * Notifica cambio de estado del viaje
   */
  async notifyTripStatusChanged(data: {
    tripId: number
    tripName: string
    oldStatus: string
    newStatus: string
    clients: Array<{ name: string; email: string; phone?: string }>
  }): Promise<void> {
    await this.emit('trip.status.changed', data)
  }

  /**
   * ===========================
   * RESUMEN DE SERVICIOS
   * ===========================
   */

  /**
   * Envía resumen final al completar un servicio
   */
  async notifyServiceCompleted(data: {
    tripId: number
    tripName: string
    startDate: string
    endDate: string
    destination: string
    summary: {
      activitiesCompleted: number
      totalDistance?: number
      accommodations: string[]
      highlights: string[]
    }
    mainClient: {
      name: string
      email: string
      phone?: string
    }
  }): Promise<void> {
    await this.emit('service.completed', data)
  }
}

// Exportar una instancia singleton
export default new NotificationService()
