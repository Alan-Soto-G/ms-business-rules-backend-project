import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const AirlinesController = () => import('#controllers/transportation/airlines_controller')

export default router
  .group(() => {
    router.get('/', [AirlinesController, 'index'])
    router.get('/:id', [AirlinesController, 'show'])
    router.post('/', [AirlinesController, 'store'])
    router.put('/:id', [AirlinesController, 'update'])
    router.delete('/:id', [AirlinesController, 'destroy'])
  })
  .prefix('/api/airlines')
//.use(middleware.Security)
