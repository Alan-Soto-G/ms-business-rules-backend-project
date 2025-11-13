import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AircraftsController = () => import('#controllers/aircrafts_controller')

export default router
  .group(() => {
    router.get('/', [AircraftsController, 'findAircraft'])
    router.get('/:id', [AircraftsController, 'findAircraft'])
    router.post('/', [AircraftsController, 'createAircraft'])
    router.put('/:id', [AircraftsController, 'updateAircraft'])
    router.delete('/:id', [AircraftsController, 'deleteAircraft'])
  })
  .prefix('/api/aircrafts')
  .use(middleware.Security)
