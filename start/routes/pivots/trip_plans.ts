import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const TripPlansController = () => import('#controllers/pivots/trip_plans_controller')

// CRUD routes for trip plans
router
  .group(() => {
    // GET all trip plans (with optional pagination)
    router.get('/', [TripPlansController, 'index'])

    // GET trip plans by trip
    router.get('/trip/:tripId', [TripPlansController, 'getByTrip'])

    // GET trip plans by plan
    router.get('/plan/:planId', [TripPlansController, 'getByPlan'])

    // POST assign plan to trip
    router.post('/assign', [TripPlansController, 'assign'])

    // DELETE unassign plan from trip
    router.delete('/unassign/:tripId/:planId', [TripPlansController, 'unassign'])

    // GET trip plan by ID
    router.get('/:id', [TripPlansController, 'show'])

    // POST create trip plan
    router.post('/', [TripPlansController, 'store'])

    // PUT/PATCH update trip plan
    router.put('/:id', [TripPlansController, 'update'])
    router.patch('/:id', [TripPlansController, 'update'])

    // DELETE trip plan
    router.delete('/:id', [TripPlansController, 'destroy'])
  })
  .prefix('/api/trip-plans')
//.use([middleware.Security()])

export default router
