import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const CarsController = () => import('#controllers/transportation/cars_controller')

export default router
  .group(() => {
    router.get('/', [CarsController, 'index'])
    router.get('/:id', [CarsController, 'show'])
    router.post('/', [CarsController, 'store'])
    router.put('/:id', [CarsController, 'update'])
    router.delete('/:id', [CarsController, 'destroy'])
  })
  .prefix('/api/cars')
//.use(middleware.Security)
