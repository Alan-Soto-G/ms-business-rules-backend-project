import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const PlansController = () => import('#controllers/core/plans_controller')

export default router
  .group(() => {
    router.get('/', [PlansController, 'index'])
    router.get('/:id', [PlansController, 'show'])
    router.post('/', [PlansController, 'store'])
    router.put('/:id', [PlansController, 'update'])
    router.delete('/:id', [PlansController, 'destroy'])
  })
  .prefix('/api/plans')
//.use([middleware.Security()])
