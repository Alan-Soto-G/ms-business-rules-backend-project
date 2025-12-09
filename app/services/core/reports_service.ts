// app/services/core/reports_service.ts
import Trip from '#models/core/trip'
import Database from '@adonisjs/lucid/services/db'

interface RevenueDataPoint {
  date: string
  revenue: number
}

interface MunicipalityTripsCount {
  municipalityId: number
  municipalityName: string
  tripCount: number
}

interface TransportTypeDistribution {
  type: 'aereo' | 'terrestre'
  count: number
  percentage: number
}

interface DashboardData {
  revenueHistory: RevenueDataPoint[]
  municipalityTrips: MunicipalityTripsCount[]
  transportDistribution: TransportTypeDistribution[]
}

export default class ReportsService {
  /**
   * Obtiene el histórico de dinero recolectado en todos los viajes vendidos
   * Agrupa por fecha (mes/año) y suma los precios de los trips
   */
  async getRevenueHistory(): Promise<RevenueDataPoint[]> {
    try {
      // Obtener trips que no estén en estado 'draft' o 'cancelled'
      const trips = await Trip.query()
        .whereNotIn('status', ['draft', 'cancelled'])
        .orderBy('start_date', 'asc')

      if (trips.length === 0) {
        console.log('No trips found for revenue history')
        return []
      }

      // Agrupar por mes/año y sumar ingresos
      const revenueMap = new Map<string, number>()

      for (const trip of trips) {
        // Formato: YYYY-MM
        const monthKey = trip.startDate.toFormat('yyyy-MM')
        const currentRevenue = revenueMap.get(monthKey) || 0
        revenueMap.set(monthKey, currentRevenue + trip.price)
      }

      // Convertir a array ordenado
      const revenueHistory: RevenueDataPoint[] = Array.from(revenueMap.entries())
        .map(([date, revenue]) => ({
          date,
          revenue,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))

      return revenueHistory
    } catch (error) {
      console.error('Error in getRevenueHistory:', error)
      throw error
    }
  }

  /**
   * Obtiene la cantidad de viajes que ha recibido cada municipio
   * Cuenta los viajes cuyo destino es cada municipio
   */
  async getMunicipalityTripsCount(): Promise<MunicipalityTripsCount[]> {
    try {
      // Obtener todos los itinerarios de transporte con sus viajes y municipios de destino
      const result = await Database.from('transport_itineraries as ti')
        .innerJoin('journeys as j', 'ti.journey_id', 'j.id')
        .innerJoin('municipalities as m', 'j.destination_municipality_id', 'm.id')
        .innerJoin('trips as t', 'ti.trip_id', 't.id')
        .whereNotIn('t.status', ['draft', 'cancelled'])
        .select('m.id as municipalityId', 'm.name as municipalityName')
        .countDistinct('t.id as tripCount')
        .groupBy('m.id', 'm.name')
        .orderBy('tripCount', 'desc')

      if (!result || result.length === 0) {
        console.log('No municipality trips found')
        return []
      }

      return result.map((row: any) => ({
        municipalityId: row.municipalityId,
        municipalityName: row.municipalityName,
        tripCount: parseInt(row.tripCount || '0', 10),
      }))
    } catch (error) {
      console.error('Error in getMunicipalityTripsCount:', error)
      throw error
    }
  }

  /**
   * Obtiene el porcentaje de veces que se utilizó transporte aéreo vs terrestre
   * Basado en el tipo de vehículo (aircraft vs car)
   */
  async getTransportTypeDistribution(): Promise<TransportTypeDistribution[]> {
    try {
      console.log('Getting transport type distribution...')

      // Obtener todos los vehículos con sus tipos
      const vehicles = await Database.from('vehicles')
        .select('vehicle_type')
        .count('* as count')
        .groupBy('vehicle_type')

      console.log('Vehicles by type:', vehicles)

      let aereoCount = 0
      let terrestreCount = 0

      for (const vehicleRow of vehicles) {
        const vehicleType = vehicleRow.vehicle_type?.toLowerCase() || ''
        const count = parseInt(vehicleRow.count || '0', 10)

        // Determinar si es aéreo o terrestre
        // Aéreo: avion, aircraft, airplane, plane
        if (
          vehicleType.includes('avion') ||
          vehicleType.includes('aircraft') ||
          vehicleType.includes('airplane') ||
          vehicleType.includes('plane')
        ) {
          aereoCount += count
        }
        // Terrestre: bus, camioneta, carro, van, car, vehiculo
        else if (
          vehicleType.includes('bus') ||
          vehicleType.includes('camioneta') ||
          vehicleType.includes('carro') ||
          vehicleType.includes('van') ||
          vehicleType.includes('car') ||
          vehicleType.includes('vehiculo')
        ) {
          terrestreCount += count
        }
      }

      const total = aereoCount + terrestreCount

      if (total === 0) {
        console.log('No vehicles found')
        return [
          { type: 'aereo', count: 0, percentage: 0 },
          { type: 'terrestre', count: 0, percentage: 0 },
        ]
      }

      const result: TransportTypeDistribution[] = [
        {
          type: 'aereo' as const,
          count: aereoCount,
          percentage: Math.round((aereoCount / total) * 100 * 100) / 100,
        },
        {
          type: 'terrestre' as const,
          count: terrestreCount,
          percentage: Math.round((terrestreCount / total) * 100 * 100) / 100,
        },
      ]

      console.log('Transport distribution result:', result)
      return result
    } catch (error) {
      console.error('Error in getTransportTypeDistribution:', error)
      throw error
    }
  }

  /**
   * Obtiene todos los datos del dashboard en una sola llamada
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      console.log('Starting getDashboardData...')
      const [revenueHistory, municipalityTrips, transportDistribution] = await Promise.all([
        this.getRevenueHistory(),
        this.getMunicipalityTripsCount(),
        this.getTransportTypeDistribution(),
      ])

      console.log('Dashboard data retrieved successfully')
      return {
        revenueHistory,
        municipalityTrips,
        transportDistribution,
      }
    } catch (error) {
      console.error('Error in getDashboardData:', error)
      throw error
    }
  }

  /**
   * Reporte adicional: Estadísticas generales
   */
  async getGeneralStatistics() {
    const [totalTrips, activeTrips, completedTrips, totalRevenue, averageTripPrice] =
      await Promise.all([
        Trip.query().whereNotIn('status', ['draft', 'cancelled']).count('* as total'),
        Trip.query().where('status', 'active').count('* as total'),
        Trip.query().where('status', 'completed').count('* as total'),
        Trip.query().whereNotIn('status', ['draft', 'cancelled']).sum('price as total'),
        Trip.query().whereNotIn('status', ['draft', 'cancelled']).avg('price as average'),
      ])

    return {
      totalTrips: parseInt(totalTrips[0].$extras.total || '0', 10),
      activeTrips: parseInt(activeTrips[0].$extras.total || '0', 10),
      completedTrips: parseInt(completedTrips[0].$extras.total || '0', 10),
      totalRevenue: parseFloat(totalRevenue[0].$extras.total || '0'),
      averageTripPrice: parseFloat(averageTripPrice[0].$extras.average || '0'),
    }
  }

  /**
   * Reporte adicional: Top 5 destinos más populares
   */
  async getTopDestinations(limit: number = 5) {
    const result = await Database.from('transport_itineraries as ti')
      .innerJoin('journeys as j', 'ti.journey_id', 'j.id')
      .innerJoin('municipalities as m', 'j.destination_municipality_id', 'm.id')
      .innerJoin('trips as t', 'ti.trip_id', 't.id')
      .whereNotIn('t.status', ['draft', 'cancelled'])
      .select('m.id as municipalityId', 'm.name as municipalityName', 'm.department')
      .count('DISTINCT t.id as tripCount')
      .groupBy('m.id', 'm.name', 'm.department')
      .orderBy('tripCount', 'desc')
      .limit(limit)

    return result.map((row: any) => ({
      municipalityId: row.municipalityId,
      municipalityName: row.municipalityName,
      department: row.department,
      tripCount: parseInt(row.tripCount || '0', 10),
    }))
  }

  /**
   * Reporte adicional: Ingresos por mes del año actual
   */
  async getCurrentYearMonthlyRevenue() {
    const currentYear = new Date().getFullYear()

    const trips = await Trip.query()
      .whereNotIn('status', ['draft', 'cancelled'])
      .whereBetween('start_date', [
        new Date(currentYear, 0, 1), // Enero 1
        new Date(currentYear, 11, 31), // Diciembre 31
      ])
      .orderBy('start_date', 'asc')

    // Inicializar todos los meses en 0 con formato YYYY-MM
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
      date: `${currentYear}-${String(i + 1).padStart(2, '0')}`,
      revenue: 0,
    }))

    // Sumar ingresos por mes
    for (const trip of trips) {
      const monthIndex = trip.startDate.month - 1
      monthlyRevenue[monthIndex].revenue += trip.price
    }

    return monthlyRevenue
  }
}
