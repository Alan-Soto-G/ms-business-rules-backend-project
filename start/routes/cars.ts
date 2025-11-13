import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const CarsController = () => import('#controllers/cars_controller')

export default router
  .group(() => {
    router.get('/', [CarsController, 'findCar'])
    router.get('/:id', [CarsController, 'findCar'])
    router.post('/', [CarsController, 'createCar'])
    router.put('/:id', [CarsController, 'updateCar'])
    router.delete('/:id', [CarsController, 'deleteCar'])
  })
  .prefix('/api/cars')
//.use(middleware.Security)
