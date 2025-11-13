import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ClientsController = () => import('#controllers/clients_controller')

export default router
  .group(() => {
    router.get('/', [ClientsController, 'findClient'])
    router.get('/:id', [ClientsController, 'findClient'])
    router.post('/', [ClientsController, 'createClient'])
    router.put('/:id', [ClientsController, 'updateClient'])
    router.delete('/:id', [ClientsController, 'deleteClient'])
  })
  .prefix('/api/clients')
  .use(middleware.Security)
