import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const JourneysController = () => import('#controllers/transportation/journeys_controller')

export default router
  .group(() => {
    router.get('/', [JourneysController, 'index'])
    router.get('/:id', [JourneysController, 'show'])
    router.post('/', [JourneysController, 'store'])
    router.put('/:id', [JourneysController, 'update'])
    router.delete('/:id', [JourneysController, 'destroy'])
  })
  .prefix('/api/journeys')
//.use(middleware.Security)
