/**
 * EJEMPLOS DE USO DEL SISTEMA DE NOTIFICACIONES
 *
 * Este archivo muestra cómo usar el servicio de notificaciones
 * en diferentes escenarios del microservicio de Negocio
 */

import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import notificationService from '#services/notification_service'
import { getAffectedClientsFromTrip } from '#services/helpers/notification_helpers'
import Trip from '#models/core/trip'
import Vehicle from '#models/transportation/vehicle'
import TouristActivity from '#models/tourism/tourist_activity'
import Invoice from '#models/financial/invoice'
import Booking from '#models/accommodation/booking'
import TransportItinerary from '#models/transportation/transport_itinerary'

/**
 * ========================================
 * EJEMPLO 1: Cancelar una actividad turística
 * ========================================
 *
 * Contexto: Una actividad turística debe cancelarse (clima, disponibilidad del guía, etc.)
 */
export async function cancelActivityExample(activityId: number, reason: string) {
  // 1. Obtener la actividad
  const activity = await TouristActivity.find(activityId)
  if (!activity) {
    throw new Error('Actividad no encontrada')
  }

  // 2. Obtener los planes que incluyen esta actividad
  await activity.load('planActivities', (query) => {
    query.preload('plan', (planQuery) => {
      planQuery.preload('tripPlans', (tripPlanQuery) => {
        tripPlanQuery.preload('trip')
      })
    })
  })

  // 3. Notificar a los clientes de cada viaje afectado
  for (const planActivity of activity.planActivities) {
    const plan = planActivity.plan
    for (const tripPlan of plan.tripPlans) {
      const trip = tripPlan.trip

      // Solo notificar si el viaje está activo
      if (['active', 'published'].includes(trip.status)) {
        const affectedClients = await getAffectedClientsFromTrip(trip.id)

        await notificationService.notifyActivityCancelled({
          activityId: activity.id,
          activityName: activity.name,
          reason,
          tripId: trip.id,
          tripName: trip.name,
          affectedClients,
        })
      }
    }
  }

  // 4. Actualizar el estado de la actividad (esto es opcional, depende de tu lógica)
  // activity.status = 'cancelled'
  // await activity.save()
}

/**
 * ========================================
 * EJEMPLO 2: Reportar avería de vehículo
 * ========================================
 *
 * Contexto: Un vehículo se avería durante un servicio
 */
export async function reportVehicleBreakdownExample(vehicleId: number, _reason: string) {
  // 1. Obtener el vehículo
  const vehicle = await Vehicle.find(vehicleId)
  if (!vehicle) {
    throw new Error('Vehículo no encontrado')
  }

  // 2. Cambiar el estado (esto dispara automáticamente el hook @beforeUpdate)
  vehicle.status = 'maintenance' // Estados válidos: available, in_use, maintenance, retired
  await vehicle.save()

  // El hook del modelo ya emitirá las notificaciones automáticamente
  // pero si necesitas hacerlo manualmente:

  /*
  await notificationService.notifyVehicleBreakdown({
    vehicleId: vehicle.id,
    licensePlate: vehicle.licensePlate,
    vehicleType: vehicle.vehicleType,
    reason,
    affectedClients: [...], // obtener clientes afectados
  })
  */
}

/**
 * ========================================
 * EJEMPLO 3: Confirmar pago de cuota
 * ========================================
 *
 * Contexto: Un cliente paga una cuota del viaje
 */
export async function confirmPaymentExample(invoiceId: number) {
  // 1. Obtener la factura
  const invoice = await Invoice.query()
    .where('id', invoiceId)
    .preload('fee', (feeQuery) => {
      feeQuery.preload('trip')
    })
    .firstOrFail()

  // 2. Actualizar la fecha de pago
  invoice.paymentDate = DateTime.now()
  await invoice.save()

  // 3. Notificar confirmación de pago
  const fee = invoice.fee
  const trip = fee.trip

  // NOTA: En producción, obtener cliente del MS de seguridad
  await notificationService.notifyPaymentAccepted({
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    amount: invoice.totalAmount,
    paymentMethod: invoice.paymentMethod,
    clientName: 'Cliente', // TODO: Obtener del MS seguridad
    clientEmail: 'cliente@example.com', // TODO: Obtener del MS seguridad
    tripId: trip.id,
    tripName: trip.name,
  })
}

/**
 * ========================================
 * EJEMPLO 4: Confirmar reserva de hotel
 * ========================================
 */
export async function confirmBookingExample(bookingId: number) {
  // 1. Obtener la reserva
  const booking = await Booking.query()
    .where('id', bookingId)
    .preload('room', (roomQuery) => {
      roomQuery.preload('hotel')
    })
    .preload('trip')
    .firstOrFail()

  // 2. Confirmar la reserva (actualizar estado si existe)
  // booking.status = 'confirmed'
  // await booking.save()

  // 3. Notificar confirmación
  // NOTA: Booking no tiene check-in/out dates ni relación con cliente
  await notificationService.notifyBookingConfirmed({
    bookingId: booking.id,
    hotelName: booking.room.hotel.name,
    roomType: booking.room.roomType,
    checkInDate: DateTime.now().toISO() || '', // TODO: Agregar al modelo Booking
    checkOutDate: DateTime.now().plus({ days: 2 }).toISO() || '', // TODO
    clientName: 'Cliente', // TODO: Obtener del Trip o MS seguridad
    clientEmail: 'cliente@example.com', // TODO
    tripId: booking.trip?.id,
    tripName: booking.trip?.name,
  })
}

/**
 * ========================================
 * EJEMPLO 5: Reportar retraso en itinerario
 * ========================================
 *
 * Contexto: Un vuelo o transporte se retrasa
 */
export async function reportItineraryDelayExample(
  transportItineraryId: number,
  delayMinutes: number,
  reason: string
) {
  // 1. Obtener el itinerario de transporte
  const itinerary = await TransportItinerary.query()
    .where('id', transportItineraryId)
    .preload('trip')
    .preload('transportationService', (serviceQuery) => {
      serviceQuery.preload('journey')
    })
    .firstOrFail()

  // 2. Obtener clientes afectados
  const affectedClients = await getAffectedClientsFromTrip(itinerary.tripId)

  // 3. Notificar el retraso
  await notificationService.notifyItinerarySegmentDelayed({
    tripId: itinerary.trip.id,
    tripName: itinerary.trip.name,
    segmentId: itinerary.id,
    segmentType: 'transporte', // TODO: Determinar tipo según tu lógica
    delayMinutes,
    reason,
    affectedClients,
  })
}

/**
 * ========================================
 * EJEMPLO 6: Completar un viaje
 * ========================================
 *
 * Contexto: Un viaje finaliza exitosamente
 */
export async function completeTripExample(tripId: number) {
  // 1. Obtener el viaje
  const trip = await Trip.find(tripId)
  if (!trip) {
    throw new Error('Viaje no encontrado')
  }

  // 2. Cambiar estado a completado (esto dispara el hook automáticamente)
  trip.status = 'completed'
  await trip.save()

  // El hook del modelo ya emitirá la notificación de servicio completado
  // Ver: app/models/core/trip.ts @beforeUpdate()
}

/**
 * ========================================
 * EJEMPLO 7: Cancelar un viaje
 * ========================================
 */
export async function cancelTripExample(tripId: number, _reason: string) {
  // 1. Obtener el viaje
  const trip = await Trip.find(tripId)
  if (!trip) {
    throw new Error('Viaje no encontrado')
  }

  // 2. Cambiar estado a cancelado (esto dispara el hook automáticamente)
  trip.status = 'cancelled'
  await trip.save()

  // El hook del modelo ya emitirá la notificación de cancelación
  // Ver: app/models/core/trip.ts @beforeUpdate()
}

/**
 * ========================================
 * EJEMPLO 8: Uso directo en un controlador
 * ========================================
 *
 * Así se vería dentro de un método de controlador real
 */
export class ExampleController {
  async updateVehicleStatus({ params, request, response }: HttpContext) {
    const vehicleId = params.id
    const { status, reason: _reason } = request.only(['status', 'reason'])

    const vehicle = await Vehicle.findOrFail(vehicleId)

    // Al actualizar el estado, el hook @beforeUpdate se ejecuta automáticamente
    vehicle.status = status
    await vehicle.save()

    return response.ok({
      message: 'Estado del vehículo actualizado',
      notification: 'Se han enviado notificaciones a los clientes afectados',
    })
  }

  async cancelActivity({ params, request, response }: HttpContext) {
    const activityId = params.id
    const { reason } = request.only(['reason'])

    await cancelActivityExample(activityId, reason)

    return response.ok({
      message: 'Actividad cancelada y clientes notificados',
    })
  }
}
