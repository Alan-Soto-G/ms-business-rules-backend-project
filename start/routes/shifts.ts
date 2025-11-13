import router from '@adonisjs/core/services/router'
const ShiftsController = () => import('#controllers/shifts_controller')

export default router
  .group(() => {
    router.get('/', [ShiftsController, 'findShift'])
    router.get('/active', [ShiftsController, 'getActiveShifts'])
    router.get('/:id', [ShiftsController, 'findShift'])
    router.post('/', [ShiftsController, 'createShift'])
    router.put('/:id', [ShiftsController, 'updateShift'])
    router.delete('/:id', [ShiftsController, 'deleteShift'])
  })
  .prefix('/api/shifts')
