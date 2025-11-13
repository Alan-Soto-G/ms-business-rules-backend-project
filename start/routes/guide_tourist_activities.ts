import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const GuideTouristActivitiesController = () =>
  import('#controllers/guide_tourist_activities_controller')

// Rutas para listar actividades de un guía
router
  .group(() => {
    router.get('/', [GuideTouristActivitiesController, 'index'])
  })
  .prefix('/api/guides/:guideId/activities')
  .use([middleware.Security()])

// Rutas para asociar/desasociar una actividad específica
router
  .group(() => {
    router.post('/', [GuideTouristActivitiesController, 'store'])
    router.delete('/', [GuideTouristActivitiesController, 'destroy'])
  })
  .prefix('/api/guides/:guideId/activities/:activityId')
  .use([middleware.Security()])
