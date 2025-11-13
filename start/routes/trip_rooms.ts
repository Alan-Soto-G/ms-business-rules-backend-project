import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const TripRoomsController = () => import('#controllers/trip_rooms_controller')

// Rutas para listar habitaciones de un viaje
router
  .group(() => {
    router.get('/', [TripRoomsController, 'index'])
  })
  .prefix('/api/trips/:tripId/rooms')
  .use([middleware.Security()])

// Rutas para asociar/desasociar una habitación específica
router
  .group(() => {
    router.post('/', [TripRoomsController, 'store'])
    router.delete('/', [TripRoomsController, 'destroy'])
  })
  .prefix('/api/trips/:tripId/rooms/:roomId')
  .use([middleware.Security()])
