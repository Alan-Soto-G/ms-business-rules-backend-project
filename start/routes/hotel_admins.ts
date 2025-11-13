import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const HotelAdminsController = () => import('#controllers/hotel_admins_controller')

export default router
  .group(() => {
    router.get('/', [HotelAdminsController, 'findHotelAdmin'])
    router.get('/:id', [HotelAdminsController, 'findHotelAdmin'])
    router.post('/', [HotelAdminsController, 'createHotelAdmin'])
    router.put('/:id', [HotelAdminsController, 'updateHotelAdmin'])
    router.delete('/:id', [HotelAdminsController, 'deleteHotelAdmin'])
  })
  .prefix('/api/hotel-admins')
  .use(middleware.Security)
