import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const BookingsController = () => import('#controllers/accommodation/bookings_controller')

// CRUD routes for bookings
router
  .group(() => {
    // GET all bookings (with optional pagination)
    router.get('/', [BookingsController, 'index'])

    // GET bookings by trip
    router.get('/trip/:tripId', [BookingsController, 'getByTrip'])

    // GET bookings by room
    router.get('/room/:roomId', [BookingsController, 'getByRoom'])

    // POST assign room to trip (book a room)
    router.post('/assign', [BookingsController, 'assign'])

    // DELETE unassign room from trip (cancel booking)
    router.delete('/unassign/:tripId/:roomId', [BookingsController, 'unassign'])

    // GET booking by ID
    router.get('/:id', [BookingsController, 'show'])

    // POST create booking
    router.post('/', [BookingsController, 'store'])

    // PUT/PATCH update booking
    router.put('/:id', [BookingsController, 'update'])
    router.patch('/:id', [BookingsController, 'update'])

    // DELETE booking
    router.delete('/:id', [BookingsController, 'destroy'])
  })
  .prefix('/api/bookings')
//.use([middleware.Security()])

export default router
