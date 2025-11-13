// start/routes.ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const FeesController = () => import('#controllers/fees_controller')

router
  .group(() => {
    router.get('/', [FeesController, 'index'])      // ✅ index en vez de find
    router.get('/:id', [FeesController, 'show'])    // ✅ show en vez de find
    router.post('/', [FeesController, 'store'])     // ✅ store en vez de create
    router.put('/:id', [FeesController, 'update'])  // ✅ update (correcto)
    router.delete('/:id', [FeesController, 'destroy']) // ✅ destroy en vez de delete
  })
  .prefix('/api/fees')  // ✅ Agregué /api para consistencia con trips
  .use([middleware.Security()]) // ✅ Igual que trips (con paréntesis y array)

