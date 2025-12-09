// start/routes.ts
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const FeesController = () => import('#controllers/financial/fees_controller')

export default router
  .group(() => {
    // ✅ NUEVA RUTA - Obtener cuotas del usuario autenticado
    router.get('/my-installments', [FeesController, 'myInstallments'])
    
    // ✅ NUEVA RUTA - Obtener cuotas por TripClient
    router.get('/trip-client/:tripClientId', [FeesController, 'getByTripClient'])
    
    // Rutas existentes
    router.get('/', [FeesController, 'index'])
    router.get('/:id', [FeesController, 'show'])
    router.post('/', [FeesController, 'store'])
    router.put('/:id', [FeesController, 'update'])
    router.delete('/:id', [FeesController, 'destroy'])
  })
  .prefix('/api/fees')
  //.use(middleware.Security)