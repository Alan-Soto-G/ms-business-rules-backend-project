import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const ClientsController = () => import('#controllers/core/clients_controller')

export default router
  .group(() => {
    router.get('/', [ClientsController, 'index'])
    router.get('/:id', [ClientsController, 'show'])
    router.post('/', [ClientsController, 'store'])
    router.put('/:id', [ClientsController, 'update'])
    router.delete('/:id', [ClientsController, 'destroy'])
  })
  .prefix('/api/clients')
// .use(middleware.Security)
