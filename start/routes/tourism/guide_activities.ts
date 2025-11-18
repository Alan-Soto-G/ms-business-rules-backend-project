import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const GuideActivitiesController = () => import('#controllers/tourism/guide_activities_controller')

// CRUD routes for guide activities
router
  .group(() => {
    // GET all guide activities (with optional pagination)
    router.get('/', [GuideActivitiesController, 'index'])

    // GET guide activities by guide
    router.get('/guide/:guideId', [GuideActivitiesController, 'getByGuide'])

    // GET guide activities by activity
    router.get('/activity/:activityId', [GuideActivitiesController, 'getByActivity'])

    // POST assign guide to activity
    router.post('/assign', [GuideActivitiesController, 'assign'])

    // DELETE unassign guide from activity
    router.delete('/unassign/:guideId/:activityId', [GuideActivitiesController, 'unassign'])

    // GET guide activity by ID
    router.get('/:id', [GuideActivitiesController, 'show'])

    // POST create guide activity
    router.post('/', [GuideActivitiesController, 'store'])

    // PUT/PATCH update guide activity
    router.put('/:id', [GuideActivitiesController, 'update'])
    router.patch('/:id', [GuideActivitiesController, 'update'])

    // DELETE guide activity
    router.delete('/:id', [GuideActivitiesController, 'destroy'])
  })
  .prefix('/api/guide-activities')
//.use([middleware.Security()])

export default router
