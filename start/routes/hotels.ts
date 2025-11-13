import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const HotelsController = () => import('#controllers/hotels_controller')

export default router
  .group(() => {
    router.get('/', [HotelsController, 'findHotel'])
    router.get('/:id', [HotelsController, 'findHotel'])
    router.post('/', [HotelsController, 'createHotel'])
    router.put('/:id', [HotelsController, 'updateHotel'])
    router.delete('/:id', [HotelsController, 'deleteHotel'])
  })
  .prefix('/hotels')
  .use(middleware.Security)
