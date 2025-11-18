import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const PlanActivitiesController = () => import('#controllers/tourism/plan_activities_controller')

// CRUD routes for plan activities
router
  .group(() => {
    // GET all plan activities (with optional pagination)
    router.get('/', [PlanActivitiesController, 'index'])

    // GET plan activities by plan
    router.get('/plan/:planId', [PlanActivitiesController, 'getByPlan'])

    // GET plan activities by activity
    router.get('/activity/:activityId', [PlanActivitiesController, 'getByActivity'])

    // POST assign activity to plan
    router.post('/assign', [PlanActivitiesController, 'assign'])

    // DELETE unassign activity from plan
    router.delete('/unassign/:planId/:activityId', [PlanActivitiesController, 'unassign'])

    // GET plan activity by ID
    router.get('/:id', [PlanActivitiesController, 'show'])

    // POST create plan activity
    router.post('/', [PlanActivitiesController, 'store'])

    // PUT/PATCH update plan activity
    router.put('/:id', [PlanActivitiesController, 'update'])
    router.patch('/:id', [PlanActivitiesController, 'update'])

    // DELETE plan activity
    router.delete('/:id', [PlanActivitiesController, 'destroy'])
  })
  .prefix('/api/plan-activities')
//.use([middleware.Security()])

export default router
