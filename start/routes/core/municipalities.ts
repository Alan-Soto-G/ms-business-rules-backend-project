import router from '@adonisjs/core/services/router'
//import { middleware } from '#start/kernel'
const MunicipalitiesController = () => import('#controllers/core/municipalities_controller')

export default router
  .group(() => {
    router.get('/', [MunicipalitiesController, 'index'])
    router.get('/:id', [MunicipalitiesController, 'show'])
    router.post('/', [MunicipalitiesController, 'store'])
    router.put('/:id', [MunicipalitiesController, 'update'])
    router.delete('/:id', [MunicipalitiesController, 'destroy'])
  })
  .prefix('/api/municipalities')
//.use(middleware.Security)
