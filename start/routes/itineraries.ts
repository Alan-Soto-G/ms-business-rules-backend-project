import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ItinerariesController = () => import('#controllers/itineraries_controller')

router
  .group(() => {
    router.get('/', [ItinerariesController, 'find'])
    router.get('/:id', [ItinerariesController, 'find'])
    router.post('/', [ItinerariesController, 'create'])
    router.put('/:id', [ItinerariesController, 'update'])
    router.delete('/:id', [ItinerariesController, 'delete'])

    // Rutas para filtrar por municipio
    router.get('/origin/:municipalityId', [ItinerariesController, 'findByOrigin'])
    router.get('/destination/:municipalityId', [ItinerariesController, 'findByDestination'])
  })
  .prefix('/itineraries')
  .use(middleware.Security)
