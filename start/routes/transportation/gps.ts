import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const GpsController = () => import('#controllers/transportation/gps_controller')

export default router
  .group(() => {
    // CRUD básico
    router.get('/', [GpsController, 'index'])
    router.get('/:id', [GpsController, 'show'])
    router.post('/', [GpsController, 'store'])
    router.put('/:id', [GpsController, 'update'])
    router.delete('/:id', [GpsController, 'destroy'])

    // **NUEVAS RUTAS DE TRACKING GPS**
    router.get('/vehicle/:vehicleId/location', [GpsController, 'getLocation'])
    router.post('/vehicle/:vehicleId/location', [GpsController, 'updateLocation'])
  })
  .prefix('/api/gps')
//.use(middleware.Security)