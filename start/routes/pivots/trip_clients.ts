import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const TripClientsController = () => import('#controllers/pivots/trip_clients_controller')

// CRUD routes for trip clients
router
  .group(() => {
    // GET all trip clients (with optional pagination)
    router.get('/', [TripClientsController, 'index'])

    // GET trip clients by trip
    router.get('/trip/:tripId', [TripClientsController, 'getByTrip'])

    // GET trip clients by client
    router.get('/client/:clientId', [TripClientsController, 'getByClient'])

    // POST assign client to trip
    router.post('/assign', [TripClientsController, 'assign'])

    // DELETE unassign client from trip
    router.delete('/unassign/:tripId/:clientId', [TripClientsController, 'unassign'])

    // GET trip client by ID
    router.get('/:id', [TripClientsController, 'show'])

    // POST create trip client
    router.post('/', [TripClientsController, 'store'])

    // PUT/PATCH update trip client
    router.put('/:id', [TripClientsController, 'update'])
    router.patch('/:id', [TripClientsController, 'update'])

    // DELETE trip client
    router.delete('/:id', [TripClientsController, 'destroy'])
  })
  .prefix('/api/trip-clients')
//.use(middleware.Security)

export default router
