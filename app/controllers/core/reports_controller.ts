// app/controllers/core/reports_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import ReportsService from '#services/core/reports_service'

export default class ReportsController {
  private reportsService: ReportsService

  constructor() {
    this.reportsService = new ReportsService()
  }

  /**
   * GET /api/reports/dashboard
   * Obtiene todos los datos del dashboard (histórico de ingresos, viajes por municipio, distribución de transporte)
   */
  async getDashboard({ response }: HttpContext) {
    try {
      const data = await this.reportsService.getDashboardData()
      return response.ok({
        success: true,
        message: 'Dashboard data retrieved successfully',
        data,
      })
    } catch (error) {
      console.error('Error in getDashboard:', error)
      return response.internalServerError({
        success: false,
        message: error.message || 'Error retrieving dashboard data',
        data: null,
      })
    }
  }

  /**
   * GET /api/reports/revenue-history
   * Obtiene el histórico de dinero recolectado en todos los viajes vendidos
   */
  async getRevenueHistory({ response }: HttpContext) {
    try {
      const data = await this.reportsService.getRevenueHistory()
      return response.ok({
        success: true,
        message: 'Revenue history retrieved successfully',
        data,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error retrieving revenue history',
        data: null,
      })
    }
  }

  /**
   * GET /api/reports/municipality-trips
   * Obtiene la cantidad de viajes que ha recibido cada municipio
   */
  async getMunicipalityTrips({ response }: HttpContext) {
    try {
      const data = await this.reportsService.getMunicipalityTripsCount()
      return response.ok({
        success: true,
        message: 'Municipality trips retrieved successfully',
        data,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error retrieving municipality trips count',
        data: null,
      })
    }
  }

  /**
   * GET /api/reports/transport-distribution
   * Obtiene el porcentaje de veces que se utilizó transporte aéreo vs terrestre
   */
  async getTransportDistribution({ response }: HttpContext) {
    try {
      const data = await this.reportsService.getTransportTypeDistribution()
      return response.ok({
        success: true,
        message: 'Transport distribution retrieved successfully',
        data,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error retrieving transport distribution',
        data: null,
      })
    }
  }

  /**
   * GET /api/reports/statistics
   * Obtiene estadísticas generales del sistema
   */
  async getStatistics({ response }: HttpContext) {
    try {
      const data = await this.reportsService.getGeneralStatistics()
      return response.ok({
        success: true,
        message: 'Statistics retrieved successfully',
        data,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error retrieving statistics',
        data: null,
      })
    }
  }

  /**
   * GET /api/reports/top-destinations?limit=5
   * Obtiene los destinos más populares
   */
  async getTopDestinations({ request, response }: HttpContext) {
    try {
      const limit = request.input('limit', 5)
      const data = await this.reportsService.getTopDestinations(parseInt(limit))
      return response.ok({
        success: true,
        message: 'Top destinations retrieved successfully',
        data,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error retrieving top destinations',
        data: null,
      })
    }
  }

  /**
   * GET /api/reports/monthly-revenue
   * Obtiene los ingresos mensuales del año actual
   */
  async getMonthlyRevenue({ response }: HttpContext) {
    try {
      const data = await this.reportsService.getCurrentYearMonthlyRevenue()
      return response.ok({
        success: true,
        message: 'Monthly revenue retrieved successfully',
        data,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Error retrieving monthly revenue',
        data: null,
      })
    }
  }
}
