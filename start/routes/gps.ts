import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const GpsController = () => import('#controllers/gps_controller')

export default router
  .group(() => {
    router.get('/', [GpsController, 'find'])
    router.get('/:id', [GpsController, 'find'])
    router.post('/', [GpsController, 'create'])
    router.put('/:id', [GpsController, 'update'])
    router.delete('/:id', [GpsController, 'delete'])
  })
  .prefix('/api/gps')
//.use(middleware.Security)
