import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const AirlinesController = () => import('#controllers/airlines_controller')

export default router
  .group(() => {
    router.get('/', [AirlinesController, 'find'])
    router.get('/:id', [AirlinesController, 'find'])
    router.post('/', [AirlinesController, 'create'])
    router.put('/:id', [AirlinesController, 'update'])
    router.delete('/:id', [AirlinesController, 'delete'])
  })
  .prefix('/api/airlines')
//.use(middleware.Security)
