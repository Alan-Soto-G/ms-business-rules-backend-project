import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import GpsService from '#services/transportation/gps_service'
import Vehicle from '#models/transportation/vehicle'

export default class SimulateGps extends BaseCommand {
  static commandName = 'simulate:gps'
  static description = 'Simulate GPS tracking for vehicles'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const gpsService = new GpsService()

    this.logger.info('🚗 Iniciando simulador GPS...')

    // Obtener vehículos con GPS
    const allVehicles = await Vehicle.query().preload('gps')
    const vehicles = allVehicles.filter((v) => v.gps !== null)

    if (vehicles.length === 0) {
      this.logger.warning('⚠️  No hay vehículos con GPS configurado')
      return
    }

    this.logger.info(`📍 Simulando ${vehicles.length} vehículo(s)`)

    // Coordenadas iniciales (puedes cambiarlas)
    // Ejemplo: Manizales, Colombia
    const routes: Map<number, { lat: number; lng: number; bearing: number; speed: number }> =
      new Map()

    vehicles.forEach((vehicle) => {
      routes.set(vehicle.id, {
        lat: 5.06889, // Manizales
        lng: -75.51738,
        bearing: Math.random() * 360, // Dirección aleatoria
        speed: 40 + Math.random() * 40, // 40-80 km/h
      })
    })

    // Simular movimiento cada 3 segundos
    const interval = setInterval(async () => {
      for (const vehicle of vehicles) {
        const route = routes.get(vehicle.id)!

        // Simular movimiento (aprox. 100m por update)
        const distance = 0.001 // ~111 metros en grados
        const radians = (route.bearing * Math.PI) / 180

        route.lat += distance * Math.cos(radians)
        route.lng += distance * Math.sin(radians)

        // Cambiar dirección aleatoriamente
        route.bearing += (Math.random() - 0.5) * 30

        // Variar velocidad
        route.speed = Math.max(20, Math.min(100, route.speed + (Math.random() - 0.5) * 10))

        // Actualizar en la BD
        await gpsService.updateLocation(vehicle.id, {
          latitude: route.lat,
          longitude: route.lng,
          speed: Math.round(route.speed),
        })

        this.logger.info(
          `🚗 Vehículo ${vehicle.id}: [${route.lat.toFixed(5)}, ${route.lng.toFixed(5)}] @ ${Math.round(route.speed)} km/h`
        )
      }
    }, 3000) // Cada 3 segundos

    this.logger.info('✅ Simulador en ejecución. Presiona Ctrl+C para detener.')

    // Cleanup al detener
    process.on('SIGINT', () => {
      clearInterval(interval)
      this.logger.info('🛑 Simulador detenido')
      process.exit(0)
    })
  }
}