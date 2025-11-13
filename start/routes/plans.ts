import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const PlansController = () => import('#controllers/plans_controller')

router
  .group(() => {
    router.get('/', [PlansController, 'findPlan'])
    router.get('/:id', [PlansController, 'findPlan'])
    router.post('/', [PlansController, 'createPlan'])
    router.put('/:id', [PlansController, 'updatePlan'])
    router.delete('/:id', [PlansController, 'deletePlan'])
  })
  .prefix('/api/plans')
//.use([middleware.Security()])
