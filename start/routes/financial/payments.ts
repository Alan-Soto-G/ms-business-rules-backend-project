// start/routes/payments.ts (o donde tengas tus rutas de pagos)
import router from '@adonisjs/core/services/router'

const PaymentsController = () => import('#controllers/payments/payments_controller')

export default router
  .group(() => {
    router.post('/payment/confirmation', [PaymentsController, 'confirmation'])
    router.get('/payment/status', [PaymentsController, 'status'])
  })
  .prefix('/api')