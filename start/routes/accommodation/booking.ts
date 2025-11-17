import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const BookingsController = () => import('#controllers/accommodation/bookings_controller')

// Rutas para listar habitaciones/bookings de un viaje
router
  .group(() => {
    router.get('/', [BookingsController, 'index'])
  })
  .prefix('/api/trips/:tripId/bookings')
//.use([middleware.Security()])

// Rutas para asociar/desasociar una habitación específica
router
  .group(() => {
    router.post('/', [BookingsController, 'store'])
    router.delete('/', [BookingsController, 'destroy'])
  })
  .prefix('/api/trips/:tripId/bookings/:roomId')
//.use([middleware.Security()])

export default router
