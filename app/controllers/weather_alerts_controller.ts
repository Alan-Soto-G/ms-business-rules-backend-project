import type { HttpContext } from '@adonisjs/core/http'
import Shift from '#models/shift'
import axios from 'axios'
import { DateTime } from 'luxon'

const SECURITY_MS_URL = 'http://localhost:8081'
const NOTIFICATIONS_MS_URL = 'http://localhost:5000'

export default class WeatherAlertsController {
  /**
   * Enviar alerta climática a conductores en turnos activos
   */
  public async sendWeatherAlert({ request, response }: HttpContext) {
    const { alert_type, message } = request.only(['alert_type', 'message'])

    if (!message) {
      return response.status(400).json({
        message: 'El mensaje de alerta es requerido',
      })
    }

    try {
      // Obtener turnos activos (donde la fecha actual esté en el rango)
      const today = DateTime.now().toISODate()

      const activeShifts = await Shift.query()
        .where('start_date', '<=', today!)
        .where('end_date', '>=', today!)
        .preload('driver')

      if (activeShifts.length === 0) {
        return response.status(200).json({
          message: 'No hay conductores en turnos activos',
          notifications_sent: 0,
        })
      }

      // Obtener los user_id de los conductores activos
      const driverUserIds = activeShifts.map((shift) => shift.driver.userId)

      // Obtener información de los usuarios del MS de seguridad
      const userEmails: string[] = []
      for (const userId of driverUserIds) {
        try {
          const userResponse = await axios.get(`${SECURITY_MS_URL}/api/users/${userId}`)
          if (userResponse.data && userResponse.data.email) {
            userEmails.push(userResponse.data.email)
          }
        } catch (error) {
          console.error(`Error al obtener usuario ${userId}:`, error)
        }
      }

      if (userEmails.length === 0) {
        return response.status(200).json({
          message: 'No se pudieron obtener correos de los conductores',
          notifications_sent: 0,
        })
      }

      // Enviar notificaciones por correo
      const emailSubject = alert_type
        ? `Alerta Climática: ${alert_type}`
        : 'Alerta Climática Importante'

      const notificationPromises = userEmails.map((email) =>
        axios.post(`${NOTIFICATIONS_MS_URL}/send-email`, {
          recipients: email,
          subject: emailSubject,
          content: message,
          is_html: false,
        })
      )

      await Promise.allSettled(notificationPromises)

      return response.status(200).json({
        message: 'Alertas enviadas correctamente',
        notifications_sent: userEmails.length,
        active_drivers: activeShifts.length,
        emails_sent_to: userEmails,
      })
    } catch (error) {
      console.error('Error al enviar alertas climáticas:', error)
      return response.status(500).json({
        message: 'Error al procesar las alertas climáticas',
        error: error.message,
      })
    }
  }
}
