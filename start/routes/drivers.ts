import router from '@adonisjs/core/services/router'
const DriversController = () => import('#controllers/drivers_controller')

export default router
  .group(() => {
    router.get('/', [DriversController, 'findDriver'])
    router.get('/:id', [DriversController, 'findDriver'])
    router.post('/', [DriversController, 'createDriver'])
    router.put('/:id', [DriversController, 'updateDriver'])
    router.delete('/:id', [DriversController, 'deleteDriver'])
  })
  .prefix('/api/drivers')
