import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const GuidesController = () => import('#controllers/guides_controller')

export default router
  .group(() => {
    router.get('/', [GuidesController, 'findGuide'])
    router.get('/:id', [GuidesController, 'findGuide'])
    router.post('/', [GuidesController, 'createGuide'])
    router.put('/:id', [GuidesController, 'updateGuide'])
    router.delete('/:id', [GuidesController, 'deleteGuide'])
  })
  .prefix('/api/guides')
//.use(middleware.Security)

