// start/routes.ts
import router from '@adonisjs/core/services/router'

router.get('/', async () => ({ hello: 'world' }))

// Importa cada archivo de rutas
import './routes/trips.js'
import './routes/invoices.js'
import './routes/fees.js'
import './routes/bank_cards.js'