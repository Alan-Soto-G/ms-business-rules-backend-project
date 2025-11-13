import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const TripPlansController = () => import('#controllers/trip_plans_controller')

// Rutas para listar planes de un viaje
router
  .group(() => {
    router.get('/', [TripPlansController, 'index'])
  })
  .prefix('/api/trips/:tripId/plans')
  .use([middleware.Security()])

// Rutas para asociar/desasociar un plan específico
router
  .group(() => {
    router.post('/', [TripPlansController, 'store'])
    router.delete('/', [TripPlansController, 'destroy'])
  })
  .prefix('/api/trips/:tripId/plans/:planId')
  .use([middleware.Security()])
