/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

// Core routes
import './routes/core/municipalities.js'
import './routes/core/clients.js'
import './routes/core/trips.js'
import './routes/core/plans.js'

// Transportation routes
import './routes/transportation/vehicles.js'
import './routes/transportation/airlines.js'
import './routes/transportation/aircrafts.js'
import './routes/transportation/cars.js'
import './routes/transportation/gps.js'
import './routes/transportation/journeys.js'
import './routes/transportation/transportation_services.js'
import './routes/transportation/transport_itineraries.js'

// Accommodation routes
import './routes/accommodation/hotel_admins.js'
import './routes/accommodation/hotels.js'
import './routes/accommodation/rooms.js'
import './routes/accommodation/booking.js'

// Tourism routes
import './routes/tourism/guides.js'
import './routes/tourism/tourist_activities.js'
import './routes/tourism/guide_activities.js'
import './routes/tourism/plan_activities.js'

// Financial routes
import './routes/financial/bank_cards.js'
import './routes/financial/fees.js'
import './routes/financial/invoices.js'

// Pivots routes
import './routes/pivots/trip_clients.js'
import './routes/pivots/trip_plans.js'
