import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const AircraftsController = () => import('#controllers/transportation/aircrafts_controller')

export default router
  .group(() => {
    router.get('/', [AircraftsController, 'index'])
    router.get('/:id', [AircraftsController, 'show'])
    router.post('/', [AircraftsController, 'store'])
    router.put('/:id', [AircraftsController, 'update'])
    router.delete('/:id', [AircraftsController, 'destroy'])
  })
  .prefix('/api/aircrafts')
//.use(middleware.Security)
