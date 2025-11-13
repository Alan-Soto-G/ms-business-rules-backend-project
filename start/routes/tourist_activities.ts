import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const TouristActivitiesController = () => import('#controllers/tourist_activities_controller')

router
  .group(() => {
    router.get('/', [TouristActivitiesController, 'findTouristActivity'])
    router.get('/:id', [TouristActivitiesController, 'findTouristActivity'])
    router.post('/', [TouristActivitiesController, 'createTouristActivity'])
    router.put('/:id', [TouristActivitiesController, 'updateTouristActivity'])
    router.delete('/:id', [TouristActivitiesController, 'deleteTouristActivity'])
  })
  .prefix('/api/tourist-activities')
  .use([middleware.Security()])
