import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const RoomsController = () => import('#controllers/accommodation/rooms_controller')

export default router
  .group(() => {
    router.get('/', [RoomsController, 'index'])
    router.get('/:id', [RoomsController, 'show'])
    router.post('/', [RoomsController, 'store'])
    router.put('/:id', [RoomsController, 'update'])
    router.delete('/:id', [RoomsController, 'destroy'])
  })
  .prefix('/api/rooms')
//.use(middleware.Security)
