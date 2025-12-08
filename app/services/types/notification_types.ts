/**
 * Tipos de Eventos del Sistema de Notificaciones
 *
 * Define todos los tipos de eventos que pueden ser emitidos
 * al microservicio de notificaciones
 */

export enum EventType {
  // ===========================
  // ANOMÁLÍAS
  // ===========================
  ITINERARY_SEGMENT_DELAYED = 'itinerary.segment.delayed',
  VEHICLE_BREAKDOWN = 'vehicle.breakdown',
  VEHICLE_REPAIRED = 'vehicle.repaired',
  VEHICLE_REPLACED = 'vehicle.replaced',
  VEHICLE_STATUS_CHANGED = 'vehicle.status.changed',
  DRIVER_UNAVAILABLE = 'driver.unavailable',
  FLIGHT_DELAYED = 'flight.delayed',
  TRANSPORT_NOT_STARTED = 'transport.not.started',

  // ===========================
  // CANCELACIONES
  // ===========================
  ACTIVITY_CANCELLED = 'activity.cancelled',
  TRIP_CANCELLED = 'trip.cancelled',
  BOOKING_CANCELLED = 'booking.cancelled',
  TRANSPORT_SERVICE_CANCELLED = 'transport.service.cancelled',

  // ===========================
  // CONFIRMACIONES
  // ===========================
  PAYMENT_ACCEPTED = 'payment.accepted',
  PAYMENT_REJECTED = 'payment.rejected',
  BOOKING_CONFIRMED = 'booking.confirmed',
  TRIP_STATUS_CHANGED = 'trip.status.changed',
  RESERVATION_CONFIRMED = 'reservation.confirmed',

  // ===========================
  // RESUMEN DE SERVICIOS
  // ===========================
  SERVICE_COMPLETED = 'service.completed',
  TRIP_STARTED = 'trip.started',
  TRIP_COMPLETED = 'trip.completed',
}

/**
 * Interface para datos de cliente afectado
 */
export interface AffectedClient {
  name: string
  email: string
  phone?: string
}

/**
 * Interface base para todos los payloads de eventos
 */
export interface BaseEventPayload {
  timestamp?: string
  affectedClients?: AffectedClient[]
}

/**
 * Payloads específicos por tipo de evento
 */

export interface ItinerarySegmentDelayedPayload extends BaseEventPayload {
  tripId: number
  tripName: string
  segmentId: number
  segmentType: string
  delayMinutes: number
  reason?: string
  affectedClients: AffectedClient[]
}

export interface VehicleBreakdownPayload extends BaseEventPayload {
  vehicleId: number
  licensePlate: string
  vehicleType: string
  reason: string
  tripId?: number
  tripName?: string
  affectedClients: AffectedClient[]
}

export interface VehicleStatusChangedPayload extends BaseEventPayload {
  vehicleId: number
  licensePlate: string
  oldStatus: string
  newStatus: string
  tripId?: number
  tripName?: string
  affectedClients?: AffectedClient[]
}

export interface VehicleRepairedPayload extends BaseEventPayload {
  vehicleId: number
  licensePlate: string
  vehicleType: string
  tripId: number
  tripName: string
  affectedClients: AffectedClient[]
}

export interface VehicleReplacedPayload extends BaseEventPayload {
  oldVehicleId: number
  oldLicensePlate: string
  oldVehicleType: string
  newVehicleId: number
  newLicensePlate: string
  newVehicleType: string
  reason: string
  tripId: number
  tripName: string
  affectedClients: AffectedClient[]
}

export interface ActivityCancelledPayload extends BaseEventPayload {
  activityId: number
  activityName: string
  reason: string
  tripId?: number
  tripName?: string
  affectedClients: AffectedClient[]
}

export interface TripCancelledPayload extends BaseEventPayload {
  tripId: number
  tripName: string
  reason: string
  affectedClients: AffectedClient[]
}

export interface PaymentAcceptedPayload extends BaseEventPayload {
  invoiceId: number
  invoiceNumber: string
  amount: number
  paymentMethod: string
  clientName: string
  clientEmail: string
  tripId: number
  tripName: string
}

export interface BookingConfirmedPayload extends BaseEventPayload {
  bookingId: number
  hotelName: string
  roomType: string
  checkInDate: string
  checkOutDate: string
  clientName: string
  clientEmail: string
  tripId?: number
  tripName?: string
}

export interface TripStatusChangedPayload extends BaseEventPayload {
  tripId: number
  tripName: string
  oldStatus: string
  newStatus: string
  clients: AffectedClient[]
}

export interface ServiceCompletedPayload extends BaseEventPayload {
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
}
