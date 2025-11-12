// start/routes.ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const FeesController = () => import('#controllers/fees_controller')


router
  .group(() => {
    router.get('/', [FeesController, 'find'])
    router.get('/:id', [FeesController, 'find'])
    router.post('/', [FeesController, 'create'])
    router.put('/:id', [FeesController, 'update'])
    router.delete('/:id', [FeesController, 'delete'])
  })
  .prefix('/fees')
  .use(middleware.Security)

  // Ruta especial: Obtener cuotas de un viaje específico
router
  .group(() => {
    router.get('/:tripId/fees', [FeesController, 'findByTrip'])
  })
  .prefix('/api/trips')
  .use(middleware.Security)