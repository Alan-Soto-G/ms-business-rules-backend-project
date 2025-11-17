import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const HotelAdminsController = () => import('#controllers/accommodation/hotel_admins_controller')

export default router
  .group(() => {
    router.get('/', [HotelAdminsController, 'index'])
    router.get('/:id', [HotelAdminsController, 'show'])
    router.post('/', [HotelAdminsController, 'store'])
    router.put('/:id', [HotelAdminsController, 'update'])
    router.delete('/:id', [HotelAdminsController, 'destroy'])
  })
  .prefix('/api/hotel-admins')
//.use(middleware.Security)
