import router from '@adonisjs/core/services/router'
const WeatherAlertsController = () => import('#controllers/weather_alerts_controller')

export default router
  .group(() => {
    router.post('/alerta_climatica', [WeatherAlertsController, 'sendWeatherAlert'])
  })
  .prefix('/api')
