import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const TransportItinerariesController = () => import('#controllers/transportation/transport_itineraries_controller')

export default router
  .group(() => {
    router.get('/', [TransportItinerariesController, 'index'])
    router.get('/:id', [TransportItinerariesController, 'show'])
    router.post('/', [TransportItinerariesController, 'store'])
    router.put('/:id', [TransportItinerariesController, 'update'])
    router.delete('/:id', [TransportItinerariesController, 'destroy'])
  })
  .prefix('/api/transport-itineraries')
//.use(middleware.Security)

