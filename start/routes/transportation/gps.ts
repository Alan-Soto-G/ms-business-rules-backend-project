import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const GpsController = () => import('#controllers/transportation/gps_controller')

export default router
  .group(() => {
    router.get('/', [GpsController, 'index'])
    router.get('/:id', [GpsController, 'show'])
    router.post('/', [GpsController, 'store'])
    router.put('/:id', [GpsController, 'update'])
    router.delete('/:id', [GpsController, 'destroy'])
  })
  .prefix('/api/gps')
//.use(middleware.Security)
