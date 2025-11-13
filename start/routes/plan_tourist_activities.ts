import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const PlanTouristActivitiesController = () =>
  import('#controllers/plan_tourist_activities_controller')

// Rutas para listar actividades de un plan
router
  .group(() => {
    router.get('/', [PlanTouristActivitiesController, 'index'])
  })
  .prefix('/api/plans/:planId/activities')
//.use([middleware.Security()])

// Rutas para asociar/desasociar una actividad específica
router
  .group(() => {
    router.post('/', [PlanTouristActivitiesController, 'store'])
    router.delete('/', [PlanTouristActivitiesController, 'destroy'])
  })
  .prefix('/api/plans/:planId/activities/:activityId')
//.use([middleware.Security()])
