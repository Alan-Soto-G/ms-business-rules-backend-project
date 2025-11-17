import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const TransportationServicesController = () => import('#controllers/transportation/transportation_services_controller')

export default router
  .group(() => {
    router.get('/', [TransportationServicesController, 'index'])
    router.get('/:id', [TransportationServicesController, 'show'])
    router.post('/', [TransportationServicesController, 'store'])
    router.put('/:id', [TransportationServicesController, 'update'])
    router.delete('/:id', [TransportationServicesController, 'destroy'])
  })
  .prefix('/api/transportation-services')
//.use(middleware.Security)

