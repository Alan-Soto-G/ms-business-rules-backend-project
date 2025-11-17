import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'

const TouristActivitiesController = () => import('#controllers/tourism/tourist_activities_controller')

export default router
  .group(() => {
    router.get('/', [TouristActivitiesController, 'index'])
    router.get('/:id', [TouristActivitiesController, 'show'])
    router.post('/', [TouristActivitiesController, 'store'])
    router.put('/:id', [TouristActivitiesController, 'update'])
    router.delete('/:id', [TouristActivitiesController, 'destroy'])
  })
  .prefix('/api/tourist-activities')
//.use([middleware.Security()])
