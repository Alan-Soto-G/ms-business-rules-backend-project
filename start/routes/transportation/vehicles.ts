import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const VehiclesController = () => import('#controllers/transportation/vehicles_controller')

export default router
  .group(() => {
    router.get('/', [VehiclesController, 'index'])
    router.get('/:id', [VehiclesController, 'show'])
    router.post('/', [VehiclesController, 'store'])
    router.put('/:id', [VehiclesController, 'update'])
    router.delete('/:id', [VehiclesController, 'destroy'])
  })
  .prefix('/api/vehicles')
//.use(middleware.Security)
