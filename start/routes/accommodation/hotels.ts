import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const HotelsController = () => import('#controllers/accommodation/hotels_controller')

export default router
  .group(() => {
    router.get('/', [HotelsController, 'index'])
    router.get('/:id', [HotelsController, 'show'])
    router.post('/', [HotelsController, 'store'])
    router.put('/:id', [HotelsController, 'update'])
    router.delete('/:id', [HotelsController, 'destroy'])
  })
  .prefix('/api/hotels')
//.use(middleware.Security)
