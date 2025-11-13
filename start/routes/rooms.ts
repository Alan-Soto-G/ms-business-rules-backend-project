import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const RoomsController = () => import('#controllers/rooms_controller')

export default router
  .group(() => {
    router.get('/', [RoomsController, 'findRoom'])
    router.get('/:id', [RoomsController, 'findRoom'])
    router.post('/', [RoomsController, 'createRoom'])
    router.put('/:id', [RoomsController, 'updateRoom'])
    router.delete('/:id', [RoomsController, 'deleteRoom'])
  })
  .prefix('/rooms')
  .use(middleware.Security)
