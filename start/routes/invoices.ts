// start/routes.ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const InvoicesController = () => import('#controllers/invoices_controller')

router
  .group(() => {
    router.get('/', [InvoicesController, 'index'])
    router.get('/:id', [InvoicesController, 'show'])
    router.post('/', [InvoicesController, 'store'])
    router.put('/:id', [InvoicesController, 'update'])
    router.delete('/:id', [InvoicesController, 'destroy'])
  })
  .prefix('/api/invoices')
  .use(middleware.Security)

// Ruta especial: Obtener facturas de una cuota específica
router
  .group(() => {
    router.get('/:feeId/invoices', [InvoicesController, 'findByFee'])
  })
  .prefix('/api/fees')
  .middleware(middleware.Security)
