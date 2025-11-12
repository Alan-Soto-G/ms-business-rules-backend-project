import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const MunicipalitiesController = () => import('#controllers/municipalities_controller')

router
  .group(() => {
    // CRUD básico
    router.get('/', [MunicipalitiesController, 'find'])
    router.get('/:id', [MunicipalitiesController, 'find'])
    router.post('/', [MunicipalitiesController, 'create'])
    router.put('/:id', [MunicipalitiesController, 'update'])
    router.delete('/:id', [MunicipalitiesController, 'delete'])

    // Rutas para manejar itinerarios (relaciones entre municipios)
    router.post('/:id/itineraries', [MunicipalitiesController, 'addItinerary'])
    router.delete('/:id/itineraries/:destinationId', [MunicipalitiesController, 'removeItinerary'])

    // Rutas para obtener destinos y orígenes
    router.get('/:id/destinations', [MunicipalitiesController, 'getDestinations'])
    router.get('/:id/origins', [MunicipalitiesController, 'getOrigins'])
  })
  .prefix('/municipalities')
  .use(middleware.Security)
