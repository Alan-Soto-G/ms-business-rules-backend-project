import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const PlanActivitiesController = () => import('#controllers/tourism/plan_activities_controller')

// CRUD routes for plan activities
router
  .group(() => {
    router.get('/', [PlanActivitiesController, 'index'])
    router.get('/:id', [PlanActivitiesController, 'show'])
    router.post('/', [PlanActivitiesController, 'store'])
    router.put('/:id', [PlanActivitiesController, 'update'])
    router.delete('/:id', [PlanActivitiesController, 'destroy'])
  })
  .prefix('/api/plan-activities')
//.use([middleware.Security()])

export default router
