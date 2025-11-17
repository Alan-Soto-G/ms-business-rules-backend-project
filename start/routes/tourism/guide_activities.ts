import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const GuideActivitiesController = () => import('#controllers/tourism/guide_activities_controller')

// CRUD routes for guide activities
router
  .group(() => {
    router.get('/', [GuideActivitiesController, 'index'])
    router.get('/:id', [GuideActivitiesController, 'show'])
    router.post('/', [GuideActivitiesController, 'store'])
    router.put('/:id', [GuideActivitiesController, 'update'])
    router.delete('/:id', [GuideActivitiesController, 'destroy'])
  })
  .prefix('/api/guide-activities')
//.use([middleware.Security()])

export default router
