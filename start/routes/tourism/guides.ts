import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const GuidesController = () => import('#controllers/tourism/guides_controller')

export default router
  .group(() => {
    router.get('/', [GuidesController, 'index'])
    router.get('/:id', [GuidesController, 'show'])
    router.post('/', [GuidesController, 'store'])
    router.put('/:id', [GuidesController, 'update'])
    router.delete('/:id', [GuidesController, 'destroy'])
  })
  .prefix('/api/guides')
//.use(middleware.Security)
