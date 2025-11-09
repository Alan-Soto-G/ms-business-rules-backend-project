import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const TripsController = () => import('#controllers/trips_controller')

router
  .group(() => {
    router.get('/', [TripsController, 'index'])
    router.get('/:id', [TripsController, 'show'])
    router.post('/', [TripsController, 'store'])
    router.put('/:id', [TripsController, 'update'])
    router.delete('/:id', [TripsController, 'destroy'])
  })
  .prefix('/api/trips')
  .use([middleware.Security()]) // 👈 ESTA ES LA FORMA CORRECTA EN V6
