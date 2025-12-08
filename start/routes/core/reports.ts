import router from '@adonisjs/core/services/router'

const ReportsController = () => import('#controllers/core/reports_controller')

export default router
  .group(() => {
    // Endpoint principal del dashboard que retorna todos los datos
    router.get('/dashboard', [ReportsController, 'getDashboard'])

    // Endpoints individuales para cada tipo de reporte
    router.get('/revenue-history', [ReportsController, 'getRevenueHistory'])
    router.get('/municipality-trips', [ReportsController, 'getMunicipalityTrips'])
    router.get('/transport-distribution', [ReportsController, 'getTransportDistribution'])

    // Reportes adicionales
    router.get('/statistics', [ReportsController, 'getStatistics'])
    router.get('/top-destinations', [ReportsController, 'getTopDestinations'])
    router.get('/monthly-revenue', [ReportsController, 'getMonthlyRevenue'])
  })
  .prefix('/api/reports')
