/**
 * EJEMPLO DE INTEGRACIÓN EN CONTROLADOR EXISTENTE
 *
 * Este archivo muestra cómo integrar el sistema de notificaciones
 * en tus controladores ya existentes
 */

import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Trip from '#models/core/trip'
import Vehicle from '#models/transportation/vehicle'
import TouristActivity from '#models/tourism/tourist_activity'
import Invoice from '#models/financial/invoice'
import Booking from '#models/accommodation/booking'
import notificationService from '#services/notification_service'
import { getAffectedClientsFromTrip } from '#services/helpers/notification_helpers'

/**
 * Ejemplo de controlador de Trip con notificaciones integradas
 */
export default class TripsController {
  /**
   * PUT /api/trips/:id
   * Actualizar viaje - Las notificaciones se envían automáticamente via hooks
   */
  async update({ params, request, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.id)

    const data = request.only([
      'name',
      'description',
      'price',
      'capacity',
      'status',
      'startDate',
      'endDate',
      'destination',
    ])

    // Al hacer merge y save, el hook @beforeUpdate se ejecuta automáticamente
    trip.merge(data)
    await trip.save()

    // Si cambió a 'cancelled', 'completed' o 'active',
    // el hook ya envió las notificaciones ✅

    return response.ok({
      message: 'Viaje actualizado correctamente',
      data: trip,
      notifications: trip.$dirty.status
        ? 'Notificaciones enviadas automáticamente'
        : 'Sin notificaciones',
    })
  }

  /**
   * POST /api/trips/:id/cancel
   * Endpoint específico para cancelar viaje con razón
   */
  async cancel({ params, request, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.id)
    const { reason } = request.only(['reason'])

    // Verificar que el viaje no esté ya cancelado
    if (trip.status === 'cancelled') {
      return response.badRequest({
        message: 'El viaje ya está cancelado',
      })
    }

    // Obtener clientes antes de cancelar
    const affectedClients = await getAffectedClientsFromTrip(trip.id)

    // Cambiar estado (el hook enviará notificación)
    trip.status = 'cancelled'
    await trip.save()

    // Opcionalmente, puedes registrar la razón en otra tabla
    // await TripCancellation.create({ tripId: trip.id, reason })

    return response.ok({
      message: 'Viaje cancelado exitosamente',
      notificationsSent: affectedClients.length,
      reason,
    })
  }

  /**
   * POST /api/trips/:id/complete
   * Marcar viaje como completado y enviar resumen
   */
  async complete({ params, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.id)

    if (trip.status !== 'active') {
      return response.badRequest({
        message: 'Solo se pueden completar viajes activos',
      })
    }

    // Cargar información necesaria para el resumen
    await trip.load('tripPlans', (query) => {
      query.preload('plan', (planQuery) => {
        planQuery.preload('planActivities')
      })
    })

    // Calcular estadísticas para el resumen
    let activitiesCompleted = 0
    for (const tripPlan of trip.tripPlans) {
      activitiesCompleted += tripPlan.plan.planActivities.length
    }

    // Cambiar estado (el hook enviará el resumen automáticamente)
    trip.status = 'completed'
    await trip.save()

    return response.ok({
      message: 'Viaje completado',
      summary: {
        activitiesCompleted,
        destination: trip.destination,
        duration: trip.endDate.diff(trip.startDate, 'days').days,
      },
      notification: 'Resumen enviado al cliente principal',
    })
  }

  /**
   * POST /api/trips/:id/start
   * Iniciar un viaje (cambiar de published a active)
   */
  async start({ params, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.id)

    if (trip.status !== 'published') {
      return response.badRequest({
        message: 'Solo se pueden iniciar viajes publicados',
      })
    }

    // Cambiar estado (el hook notificará a los clientes)
    trip.status = 'active'
    await trip.save()

    return response.ok({
      message: 'Viaje iniciado',
      notification: 'Clientes notificados del inicio del viaje',
    })
  }

  /**
   * DELETE /api/trips/:id
   * Eliminar viaje (solo si está en draft)
   */
  async destroy({ params, response }: HttpContext) {
    const trip = await Trip.findOrFail(params.id)

    if (trip.status !== 'draft') {
      return response.badRequest({
        message: 'Solo se pueden eliminar viajes en borrador. Cancele el viaje si tiene clientes.',
      })
    }

    await trip.delete()

    return response.ok({
      message: 'Viaje eliminado exitosamente',
    })
  }
}

/**
 * EJEMPLO DE CONTROLADOR DE VEHÍCULO
 */
export class VehiclesController {
  /**
   * PATCH /api/vehicles/:id/status
   * Actualizar estado del vehículo
   */
  async updateStatus({ params, request, response }: HttpContext) {
    const vehicle = await Vehicle.findOrFail(params.id)
    const { status, reason } = request.only(['status', 'reason'])

    // Estados válidos
    const validStatuses = [
      'disponible',
      'en_servicio',
      'en_mantenimiento',
      'averiado',
      'fuera_de_servicio',
    ]

    if (!validStatuses.includes(status)) {
      return response.badRequest({
        message: `Estado inválido. Estados válidos: ${validStatuses.join(', ')}`,
      })
    }

    // Actualizar estado (el hook detectará servicios activos y notificará)
    vehicle.status = status
    await vehicle.save()

    return response.ok({
      message: `Estado del vehículo actualizado a: ${status}`,
      notification:
        status === 'maintenance' || status === 'retired'
          ? 'Clientes de servicios activos han sido notificados'
          : 'Sin notificaciones enviadas',
      reason,
    })
  }

  /**
   * POST /api/vehicles/:id/report-breakdown
   * Reportar avería de vehículo
   */
  async reportBreakdown({ params, request, response }: HttpContext) {
    const vehicle = await Vehicle.findOrFail(params.id)
    const { reason: _reason, estimatedRepairTime: _estimatedRepairTime } = request.only([
      'reason',
      'estimatedRepairTime',
    ])

    // Cambiar a estado de mantenimiento (notificaciones automáticas)
    vehicle.status = 'maintenance' // Estados válidos: available, in_use, maintenance, retired
    await vehicle.save()

    // Aquí podrías registrar más detalles en otra tabla
    // await VehicleBreakdown.create({
    //   vehicleId: vehicle.id,
    //   reason,
    //   estimatedRepairTime,
    //   reportedAt: DateTime.now()
    // })

    return response.ok({
      message: 'Avería reportada y clientes notificados',
      vehicle: {
        id: vehicle.id,
        licensePlate: vehicle.licensePlate,
        status: vehicle.status,
      },
    })
  }
}

/**
 * EJEMPLO DE CONTROLADOR DE ACTIVIDADES TURÍSTICAS
 */
export class TouristActivitiesController {
  /**
   * POST /api/activities/:id/cancel
   * Cancelar actividad turística
   */
  async cancel({ params, request, response }: HttpContext) {
    const { reason } = request.only(['reason'])
    const activity = await TouristActivity.findOrFail(params.id)

    // Cargar los planes que incluyen esta actividad
    await activity.load('planActivities', (query) => {
      query.preload('plan', (planQuery) => {
        planQuery.preload('tripPlans', (tripPlanQuery) => {
          tripPlanQuery.preload('trip')
        })
      })
    })

    let notificationCount = 0

    // Notificar a todos los viajes activos afectados
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

          notificationCount += affectedClients.length
        }
      }
    }

    // Marcar actividad como no disponible (si tienes ese campo)
    // activity.available = false
    // await activity.save()

    return response.ok({
      message: 'Actividad cancelada',
      notificationsSent: notificationCount,
      reason,
    })
  }
}

/**
 * EJEMPLO DE CONTROLADOR DE PAGOS
 */
export class InvoicesController {
  /**
   * POST /api/invoices/:id/confirm-payment
   * Confirmar pago de factura
   */
  async confirmPayment({ params, response }: HttpContext) {
    const invoice = await Invoice.query()
      .where('id', params.id)
      .preload('fee', (feeQuery) => {
        feeQuery.preload('trip')
      })
      .firstOrFail()

    if (invoice.paymentDate) {
      return response.badRequest({
        message: 'Esta factura ya fue pagada',
      })
    }

    // Registrar fecha de pago
    invoice.paymentDate = DateTime.now()
    await invoice.save()

    // NOTA: En producción, obtener datos del cliente del MS de seguridad
    // Emitir notificación de pago aceptado
    await notificationService.notifyPaymentAccepted({
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.totalAmount,
      paymentMethod: invoice.paymentMethod,
      clientName: 'Cliente', // TODO: Obtener del MS seguridad
      clientEmail: 'cliente@example.com', // TODO: Obtener del MS seguridad
      tripId: invoice.fee.trip.id,
      tripName: invoice.fee.trip.name,
    })

    return response.ok({
      message: 'Pago confirmado',
      invoice: {
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.totalAmount,
        paymentDate: invoice.paymentDate,
      },
      notification: 'Confirmación enviada al cliente',
    })
  }
}

/**
 * EJEMPLO DE CONTROLADOR DE RESERVAS
 */
export class BookingsController {
  /**
   * POST /api/bookings/:id/confirm
   * Confirmar reserva de hotel
   */
  async confirm({ params, response }: HttpContext) {
    const booking = await Booking.query()
      .where('id', params.id)
      .preload('room', (roomQuery) => {
        roomQuery.preload('hotel')
      })
      .preload('trip')
      .firstOrFail()

    // Actualizar estado de la reserva (si tienes ese campo)
    // booking.status = 'confirmed'
    // await booking.save()

    // NOTA: Booking no tiene check-in/out dates ni relación directa con cliente
    // En producción, estas fechas deberían venir del Room o agregarse al modelo Booking
    // El cliente se obtendría del Trip
    await notificationService.notifyBookingConfirmed({
      bookingId: booking.id,
      hotelName: booking.room.hotel.name,
      roomType: booking.room.roomType,
      checkInDate: DateTime.now().toISO() || '', // TODO: Agregar al modelo Booking
      checkOutDate: DateTime.now().plus({ days: 2 }).toISO() || '', // TODO: Agregar al modelo
      clientName: 'Cliente', // TODO: Obtener del Trip o MS seguridad
      clientEmail: 'cliente@example.com', // TODO: Obtener del Trip o MS seguridad
      tripId: booking.trip?.id,
      tripName: booking.trip?.name,
    })

    return response.ok({
      message: 'Reserva confirmada',
      booking: {
        hotel: booking.room.hotel.name,
        room: booking.room.roomType,
      },
      notification: 'Confirmación enviada al cliente',
    })
  }
}
