// start/routes.ts
import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const InvoicesController = () => import('#controllers/financial/invoices_controller')

export default router
  .group(() => {
    router.get('/', [InvoicesController, 'index'])
    router.get('/:id', [InvoicesController, 'show'])
    router.post('/', [InvoicesController, 'store'])
    router.put('/:id', [InvoicesController, 'update'])
    router.delete('/:id', [InvoicesController, 'destroy'])
  })
  .prefix('/api/invoices')
//.use(middleware.Security)
