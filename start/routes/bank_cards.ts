// start/routes.ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const BankCardsController = () => import('#controllers/bank_cards_controller')

// Rutas de BankCards (Tarjetas Bancarias)
// ==========================================
router
  .group(() => {
    router.get('/', [BankCardsController, 'index'])
    router.get('/:id', [BankCardsController, 'show'])
    router.post('/', [BankCardsController, 'store'])
    router.put('/:id', [BankCardsController, 'update'])
    router.delete('/:id', [BankCardsController, 'destroy'])
  })
  .prefix('api/bank-cards')
 .use([middleware.Security()])
