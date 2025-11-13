import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const TripClientsController = () => import('#controllers/trip_clients_controller')

// Rutas para listar clientes de un viaje
router
  .group(() => {
    router.get('/', [TripClientsController, 'index'])
  })
  .prefix('/api/trips/:tripId/clients')
//.use([middleware.Security()])

// Rutas para asociar/desasociar un cliente específico
router
  .group(() => {
    router.post('/', [TripClientsController, 'store'])
    router.delete('/', [TripClientsController, 'destroy'])
  })
  .prefix('/api/trips/:tripId/clients/:clientId')
//.use([middleware.Security()])
