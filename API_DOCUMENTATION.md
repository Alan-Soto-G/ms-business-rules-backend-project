# 📚 Documentación de API - MS Business Rules

## 🔍 Índice

- [Introducción](#introducción)
- [Estructura de Respuestas](#estructura-de-respuestas)
- [Módulos](#módulos)
  - [Core (Núcleo)](#módulo-core-núcleo)
  - [Accommodation (Alojamiento)](#módulo-accommodation-alojamiento)
  - [Tourism (Turismo)](#módulo-tourism-turismo)
  - [Transportation (Transporte)](#módulo-transportation-transporte)
  - [Financial (Financiero)](#módulo-financial-financiero)
  - [Pivots (Relaciones)](#módulo-pivots-relaciones)

---

## 📖 Introducción

Esta API REST maneja las reglas de negocio para un sistema de gestión de viajes turísticos. Todos los endpoints siguen convenciones RESTful estándar.

### Base URL
```
http://localhost:3333/api
```

### Autenticación
La mayoría de los endpoints requieren autenticación (actualmente comentada en desarrollo). En producción, activar el middleware `Security`.

### Paginación
Los endpoints que retornan listas soportan paginación opcional:
- `?page=1` - Número de página
- `?per_page=10` - Elementos por página (default: 10)

---

## 🔄 Estructura de Respuestas

### Respuesta Exitosa (200, 201)
```json
{
  "id": 1,
  "name": "Ejemplo",
  "createdAt": "2025-11-17T10:00:00.000-05:00",
  "updatedAt": "2025-11-17T10:00:00.000-05:00"
}
```

### Respuesta con Error (400, 404, 500)
```json
{
  "message": "Descripción del error"
}
```

### Respuesta con Paginación
```json
{
  "meta": {
    "total": 100,
    "per_page": 10,
    "current_page": 1,
    "last_page": 10
  },
  "data": [...]
}
```

---

## 📦 Módulo Core (Núcleo)

### 1. **Trips (Viajes)** 🚌

**Base:** `/api/trips`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/trips` | Listar todos los viajes | - |
| GET | `/api/trips/:id` | Obtener un viaje por ID | - |
| POST | `/api/trips` | Crear un nuevo viaje | Ver ejemplo ⬇️ |
| PUT | `/api/trips/:id` | Actualizar un viaje | Ver ejemplo ⬇️ |
| DELETE | `/api/trips/:id` | Eliminar un viaje | - |

**Ejemplo POST/PUT:**
```json
{
  "name": "Tour Caribe Colombiano",
  "description": "Recorrido por las playas del caribe colombiano",
  "price": 1500000,
  "capacity": 40,
  "availableSeats": 40,
  "status": "published",
  "startDate": "2025-12-01T08:00:00.000Z",
  "endDate": "2025-12-10T18:00:00.000Z",
  "destination": "Cartagena, Santa Marta, Barranquilla"
}
```

**Campos:**
- `name` (string, required): Nombre del viaje
- `description` (string, optional): Descripción detallada
- `price` (number, required): Precio del viaje en pesos
- `capacity` (number, required): Capacidad máxima de personas
- `availableSeats` (number, required): Cupos disponibles
- `status` (string, required): Estado del viaje
- `startDate` (datetime, required): Fecha y hora de inicio
- `endDate` (datetime, required): Fecha y hora de finalización
- `destination` (string, required): Destino del viaje

---

### 2. **Clients (Clientes)** 👥

**Base:** `/api/clients`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/clients` | Listar todos los clientes | - |
| GET | `/api/clients/:id` | Obtener un cliente por ID | - |
| POST | `/api/clients` | Crear un nuevo cliente | Ver ejemplo ⬇️ |
| PUT | `/api/clients/:id` | Actualizar un cliente | Ver ejemplo ⬇️ |
| DELETE | `/api/clients/:id` | Eliminar un cliente | - |

**Ejemplo POST/PUT:**
```json
{
  "UserId": "550e8400-e29b-41d4-a716-446655440000",
  "emergencyContactName": "María García Pérez",
  "emergencyContactPhone": "+57 300 123 4567",
  "allergies": "Mariscos, lácteos",
  "loyaltyPoints": 0,
  "isVip": false
}
```

**Campos:**
- `UserId` (string, required): ID del usuario desde ms-security (UUID)
- `emergencyContactName` (string, optional): Nombre del contacto de emergencia
- `emergencyContactPhone` (string, optional): Teléfono de emergencia
- `allergies` (string, optional): Alergias o condiciones médicas
- `loyaltyPoints` (number, optional): Puntos de fidelidad (default: 0)
- `isVip` (boolean, optional): Es cliente VIP (default: false)

---

### 3. **Plans (Planes)** 📋

**Base:** `/api/plans`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/plans` | Listar todos los planes | - |
| GET | `/api/plans/:id` | Obtener un plan por ID | - |
| POST | `/api/plans` | Crear un nuevo plan | Ver ejemplo ⬇️ |
| PUT | `/api/plans/:id` | Actualizar un plan | Ver ejemplo ⬇️ |
| DELETE | `/api/plans/:id` | Eliminar un plan | - |

**Ejemplo POST/PUT:**
```json
{
  "name": "Plan Todo Incluido",
  "description": "Incluye todas las actividades, comidas y hospedaje",
  "price": 500000,
  "duration": 5
}
```

**Campos:**
- `name` (string, required): Nombre del plan
- `description` (string, optional): Descripción del plan
- `price` (number, required): Precio del plan en pesos
- `duration` (number, optional): Duración en días

---

### 4. **Municipalities (Municipios)** 🏙️

**Base:** `/api/municipalities`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/municipalities` | Listar todos los municipios | - |
| GET | `/api/municipalities/:id` | Obtener un municipio por ID | - |
| POST | `/api/municipalities` | Crear un nuevo municipio | Ver ejemplo ⬇️ |
| PUT | `/api/municipalities/:id` | Actualizar un municipio | Ver ejemplo ⬇️ |
| DELETE | `/api/municipalities/:id` | Eliminar un municipio | - |

**Ejemplo POST/PUT:**
```json
{
  "name": "Cartagena",
  "department": "Bolívar",
  "code": "13001"
}
```

**Campos:**
- `name` (string, required): Nombre del municipio
- `department` (string, required): Departamento al que pertenece
- `code` (string, required): Código único del municipio (ej: código DANE)

---

## 🏨 Módulo Accommodation (Alojamiento)

### 5. **Hotels (Hoteles)** 🏨

**Base:** `/api/hotels`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/hotels` | Listar todos los hoteles | - |
| GET | `/api/hotels/:id` | Obtener un hotel por ID | - |
| POST | `/api/hotels` | Crear un nuevo hotel | Ver ejemplo ⬇️ |
| PUT | `/api/hotels/:id` | Actualizar un hotel | Ver ejemplo ⬇️ |
| DELETE | `/api/hotels/:id` | Eliminar un hotel | - |

**Ejemplo POST/PUT:**
```json
{
  "hotelAdminId": 1,
  "municipalityId": 1,
  "name": "Hotel Caribe Plaza",
  "address": "Cra 1 # 2-50, Centro Histórico",
  "phone": "+57 5 664 1234",
  "email": "info@hotelcaribe.com",
  "starRating": 5,
  "status": "active"
}
```

**Campos:**
- `hotelAdminId` (number, required): ID del administrador del hotel
- `municipalityId` (number, required): ID del municipio donde está ubicado
- `name` (string, required): Nombre del hotel
- `address` (string, required): Dirección completa
- `phone` (string, required): Teléfono de contacto (único)
- `email` (string, required): Email de contacto (único)
- `starRating` (number, required): Calificación en estrellas (0-5)
- `status` (string, required): Estado del hotel: 'active' | 'inactive'

---

### 6. **Rooms (Habitaciones)** 🛏️

**Base:** `/api/rooms`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/rooms` | Listar todas las habitaciones | - |
| GET | `/api/rooms/:id` | Obtener una habitación por ID | - |
| POST | `/api/rooms` | Crear una nueva habitación | Ver ejemplo ⬇️ |
| PUT | `/api/rooms/:id` | Actualizar una habitación | Ver ejemplo ⬇️ |
| DELETE | `/api/rooms/:id` | Eliminar una habitación | - |

**Ejemplo POST/PUT:**
```json
{
  "hotelId": 1,
  "roomNumber": "501",
  "roomType": "suite",
  "capacity": 4,
  "pricePerNight": 250000,
  "status": "available"
}
```

**Campos:**
- `hotelId` (number, required): ID del hotel al que pertenece
- `roomNumber` (string, required): Número de habitación
- `roomType` (string, required): Tipo de habitación (single, double, suite, etc.)
- `capacity` (number, required): Capacidad máxima de personas
- `pricePerNight` (number, required): Precio por noche en pesos
- `status` (string, required): Estado: 'available' | 'occupied' | 'maintenance'

---

### 7. **Hotel Admins (Administradores de Hotel)** 👨‍💼

**Base:** `/api/hotel-admins`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/hotel-admins` | Listar todos los admins | - |
| GET | `/api/hotel-admins/:id` | Obtener un admin por ID | - |
| POST | `/api/hotel-admins` | Crear un nuevo admin | Ver ejemplo ⬇️ |
| PUT | `/api/hotel-admins/:id` | Actualizar un admin | Ver ejemplo ⬇️ |
| DELETE | `/api/hotel-admins/:id` | Eliminar un admin | - |

**Ejemplo POST/PUT:**
```json
{
  "UserId": "550e8400-e29b-41d4-a716-446655440001",
  "isVerified": true
}
```

**Campos:**
- `UserId` (string, required): ID del usuario desde ms-security (UUID)
- `isVerified` (boolean, optional): Está verificado (default: false)

---

### 8. **Bookings (Reservas)** 📅

**Base:** `/api/bookings`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/bookings` | Listar todas las reservas | - |
| GET | `/api/bookings/:id` | Obtener una reserva por ID | - |
| POST | `/api/bookings` | Crear una nueva reserva | Ver ejemplo ⬇️ |
| PUT | `/api/bookings/:id` | Actualizar una reserva | Ver ejemplo ⬇️ |
| DELETE | `/api/bookings/:id` | Eliminar una reserva | - |

**Ejemplo POST/PUT:**
```json
{
  "tripId": 1,
  "roomId": 1
}
```

**Campos:**
- `tripId` (number, required): ID del viaje
- `roomId` (number, required): ID de la habitación reservada

---

## 🎭 Módulo Tourism (Turismo)

### 9. **Tourist Activities (Actividades Turísticas)** 🎪

**Base:** `/api/tourist-activities`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/tourist-activities` | Listar todas las actividades | - |
| GET | `/api/tourist-activities/:id` | Obtener una actividad por ID | - |
| POST | `/api/tourist-activities` | Crear una nueva actividad | Ver ejemplo ⬇️ |
| PUT | `/api/tourist-activities/:id` | Actualizar una actividad | Ver ejemplo ⬇️ |
| DELETE | `/api/tourist-activities/:id` | Eliminar una actividad | - |

**Ejemplo POST/PUT:**
```json
{
  "municipalityId": 1,
  "name": "Tour Ciudad Amurallada",
  "description": "Recorrido guiado por el centro histórico de Cartagena",
  "price": 50000,
  "duration": 180,
  "category": "cultural"
}
```

**Campos:**
- `municipalityId` (number, required): ID del municipio donde se realiza
- `name` (string, required): Nombre de la actividad
- `description` (string, optional): Descripción detallada
- `price` (number, optional): Precio de la actividad en pesos
- `duration` (number, optional): Duración en minutos
- `category` (string, required): Categoría: 'cultural' | 'adventure' | 'gastronomic' | 'recreational' | 'other'

---

### 10. **Guides (Guías Turísticos)** 👨‍🏫

**Base:** `/api/guides`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/guides` | Listar todos los guías | - |
| GET | `/api/guides/:id` | Obtener un guía por ID | - |
| POST | `/api/guides` | Crear un nuevo guía | Ver ejemplo ⬇️ |
| PUT | `/api/guides/:id` | Actualizar un guía | Ver ejemplo ⬇️ |
| DELETE | `/api/guides/:id` | Eliminar un guía | - |

**Ejemplo POST/PUT:**
```json
{
  "UserId": "550e8400-e29b-41d4-a716-446655440002",
  "licenseNumber": "GT-2025-001",
  "specialties": "Historia, cultura, gastronomía colombiana",
  "rating": 4.8,
  "isAvailable": true
}
```

**Campos:**
- `UserId` (string, required): ID del usuario desde ms-security (UUID)
- `licenseNumber` (string, required): Número de licencia de guía (único)
- `specialties` (string, optional): Especialidades del guía
- `rating` (number, optional): Calificación promedio (0-5, default: 0)
- `isAvailable` (boolean, optional): Disponible para asignaciones (default: true)

---

### 11. **Guide Activities (Asignación Guías-Actividades)** 📝

**Base:** `/api/guide-activities`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/guide-activities` | Listar todas las asignaciones | - |
| GET | `/api/guide-activities/:id` | Obtener una asignación por ID | - |
| POST | `/api/guide-activities` | Asignar actividad a guía | Ver ejemplo ⬇️ |
| PUT | `/api/guide-activities/:id` | Actualizar asignación | Ver ejemplo ⬇️ |
| DELETE | `/api/guide-activities/:id` | Eliminar asignación | - |

**Ejemplo POST/PUT:**
```json
{
  "guideId": 1,
  "activityId": 1,
  "assignmentDate": "2025-12-01T09:00:00.000Z"
}
```

**Campos:**
- `guideId` (number, required): ID del guía turístico
- `activityId` (number, required): ID de la actividad turística
- `assignmentDate` (datetime, required): Fecha y hora de la asignación

---

### 12. **Plan Activities (Actividades en Planes)** 📋

**Base:** `/api/plan-activities`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/plan-activities` | Listar todas las actividades de planes | - |
| GET | `/api/plan-activities/:id` | Obtener una por ID | - |
| POST | `/api/plan-activities` | Agregar actividad a plan | Ver ejemplo ⬇️ |
| PUT | `/api/plan-activities/:id` | Actualizar | Ver ejemplo ⬇️ |
| DELETE | `/api/plan-activities/:id` | Eliminar actividad del plan | - |

**Ejemplo POST/PUT:**
```json
{
  "planId": 1,
  "activityId": 1,
  "order": 1
}
```

**Campos:**
- `planId` (number, required): ID del plan
- `activityId` (number, required): ID de la actividad turística
- `order` (number, required): Orden de la actividad en el plan (número positivo)

---

## 🚗 Módulo Transportation (Transporte)

### 13. **Vehicles (Vehículos)** 🚗

**Base:** `/api/vehicles`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/vehicles` | Listar todos los vehículos | - |
| GET | `/api/vehicles/:id` | Obtener un vehículo por ID | - |
| POST | `/api/vehicles` | Crear un nuevo vehículo | Ver ejemplo ⬇️ |
| PUT | `/api/vehicles/:id` | Actualizar un vehículo | Ver ejemplo ⬇️ |
| DELETE | `/api/vehicles/:id` | Eliminar un vehículo | - |

**Ejemplo POST/PUT:**
```json
{
  "licensePlate": "ABC123",
  "brand": "Mercedes-Benz",
  "model": "Sprinter",
  "year": 2024,
  "color": "Blanco",
  "numberOfSeats": 20,
  "vehicleType": "bus",
  "status": "active"
}
```

**Campos:**
- `licensePlate` (string, required): Placa del vehículo (único)
- `brand` (string, required): Marca del vehículo
- `model` (string, required): Modelo del vehículo
- `year` (number, required): Año del vehículo
- `color` (string, required): Color del vehículo
- `numberOfSeats` (number, required): Número de asientos
- `vehicleType` (string, required): Tipo de vehículo (car, bus, van, etc.)
- `status` (string, required): Estado del vehículo

---

### 14. **Airlines (Aerolíneas)** ✈️

**Base:** `/api/airlines`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/airlines` | Listar todas las aerolíneas | - |
| GET | `/api/airlines/:id` | Obtener una aerolínea por ID | - |
| POST | `/api/airlines` | Crear una nueva aerolínea | Ver ejemplo ⬇️ |
| PUT | `/api/airlines/:id` | Actualizar una aerolínea | Ver ejemplo ⬇️ |
| DELETE | `/api/airlines/:id` | Eliminar una aerolínea | - |

**Ejemplo POST/PUT:**
```json
{
  "name": "Avianca",
  "codeIata": "AV",
  "codeIcao": "AVA",
  "countryOfOrigin": "Colombia",
  "isActive": true
}
```

**Campos:**
- `name` (string, required): Nombre de la aerolínea
- `codeIata` (string, required): Código IATA (2 caracteres, único)
- `codeIcao` (string, required): Código ICAO (3 caracteres, único)
- `countryOfOrigin` (string, required): País de origen
- `isActive` (boolean, optional): Aerolínea activa (default: true)

---

### 15. **Aircrafts (Aeronaves)** 🛩️

**Base:** `/api/aircrafts`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/aircrafts` | Listar todas las aeronaves | - |
| GET | `/api/aircrafts/:id` | Obtener una aeronave por ID | - |
| POST | `/api/aircrafts` | Crear una nueva aeronave | Ver ejemplo ⬇️ |
| PUT | `/api/aircrafts/:id` | Actualizar una aeronave | Ver ejemplo ⬇️ |
| DELETE | `/api/aircrafts/:id` | Eliminar una aeronave | - |

**Ejemplo POST/PUT:**
```json
{
  "vehicleId": 1,
  "airlineId": 1,
  "registrationCountry": "Colombia",
  "maxAltitude": 12000
}
```

**Campos:**
- `vehicleId` (number, required): ID del vehículo (relación 1:1, único)
- `airlineId` (number, required): ID de la aerolínea propietaria
- `registrationCountry` (string, required): País de registro
- `maxAltitude` (number, optional): Altitud máxima en metros

---

### 16. **Cars (Vehículos Terrestres)** 🚗

**Base:** `/api/cars`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/cars` | Listar todos los vehículos terrestres | - |
| GET | `/api/cars/:id` | Obtener un vehículo por ID | - |
| POST | `/api/cars` | Crear un nuevo vehículo | Ver ejemplo ⬇️ |
| PUT | `/api/cars/:id` | Actualizar un vehículo | Ver ejemplo ⬇️ |
| DELETE | `/api/cars/:id` | Eliminar un vehículo | - |

**Ejemplo POST/PUT:**
```json
{
  "vehicleId": 2,
  "hotelId": 1,
  "fuelType": "diesel",
  "transmissionType": "manual"
}
```

**Campos:**
- `vehicleId` (number, required): ID del vehículo (relación 1:1, único)
- `hotelId` (number, required): ID del hotel propietario
- `fuelType` (string, required): Tipo de combustible
- `transmissionType` (string, required): Tipo de transmisión

---

### 17. **GPS** 📡

**Base:** `/api/gps`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/gps` | Listar todos los GPS | - |
| GET | `/api/gps/:id` | Obtener un GPS por ID | - |
| POST | `/api/gps` | Crear un nuevo GPS | Ver ejemplo ⬇️ |
| PUT | `/api/gps/:id` | Actualizar un GPS | Ver ejemplo ⬇️ |
| DELETE | `/api/gps/:id` | Eliminar un GPS | - |

**Ejemplo POST/PUT:**
```json
{
  "vehicleId": 1,
  "serialNumber": "GPS-2025-001",
  "brand": "Garmin",
  "model": "Drive 52",
  "isActive": true
}
```

**Campos:**
- `vehicleId` (number, required): ID del vehículo (relación 1:1, único)
- `serialNumber` (string, required): Número de serie (único)
- `brand` (string, required): Marca del GPS
- `model` (string, required): Modelo del GPS
- `isActive` (boolean, optional): GPS activo (default: true)

---

### 18. **Journeys (Trayectos)** 🗺️

**Base:** `/api/journeys`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/journeys` | Listar todos los trayectos | - |
| GET | `/api/journeys/:id` | Obtener un trayecto por ID | - |
| POST | `/api/journeys` | Crear un nuevo trayecto | Ver ejemplo ⬇️ |
| PUT | `/api/journeys/:id` | Actualizar un trayecto | Ver ejemplo ⬇️ |
| DELETE | `/api/journeys/:id` | Eliminar un trayecto | - |

**Ejemplo POST/PUT:**
```json
{
  "originMunicipalityId": 1,
  "destinationMunicipalityId": 2,
  "distance": 150.5
}
```

**Campos:**
- `originMunicipalityId` (number, required): ID del municipio de origen
- `destinationMunicipalityId` (number, required): ID del municipio de destino
- `distance` (number, optional): Distancia en kilómetros

---

### 19. **Transportation Services (Servicios de Transporte)** 🚌

**Base:** `/api/transportation-services`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/transportation-services` | Listar todos los servicios | - |
| GET | `/api/transportation-services/:id` | Obtener un servicio por ID | - |
| POST | `/api/transportation-services` | Crear un nuevo servicio | Ver ejemplo ⬇️ |
| PUT | `/api/transportation-services/:id` | Actualizar un servicio | Ver ejemplo ⬇️ |
| DELETE | `/api/transportation-services/:id` | Eliminar un servicio | - |

**Ejemplo POST/PUT:**
```json
{
  "journeyId": 1,
  "vehicleId": 1,
  "startDate": "2025-12-01T08:00:00.000Z",
  "endDate": "2025-12-01T12:00:00.000Z",
  "cost": 150000
}
```

**Campos:**
- `journeyId` (number, required): ID del trayecto
- `vehicleId` (number, required): ID del vehículo asignado
- `startDate` (datetime, required): Fecha y hora de inicio del servicio
- `endDate` (datetime, required): Fecha y hora de finalización
- `cost` (number, required): Costo del servicio en pesos

---

### 20. **Transport Itineraries (Itinerarios de Transporte)** 🛣️

**Base:** `/api/transport-itineraries`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/transport-itineraries` | Listar todos los itinerarios | - |
| GET | `/api/transport-itineraries/:id` | Obtener un itinerario por ID | - |
| POST | `/api/transport-itineraries` | Crear un nuevo itinerario | Ver ejemplo ⬇️ |
| PUT | `/api/transport-itineraries/:id` | Actualizar un itinerario | Ver ejemplo ⬇️ |
| DELETE | `/api/transport-itineraries/:id` | Eliminar un itinerario | - |

**Ejemplo POST/PUT:**
```json
{
  "journeyId": 1,
  "tripId": 1,
  "transportationServiceId": 1,
  "order": 1
}
```

**Campos:**
- `journeyId` (number, required): ID del trayecto
- `tripId` (number, required): ID del viaje
- `transportationServiceId` (number, required): ID del servicio de transporte
- `order` (number, required): Orden en el itinerario (número positivo)

---

## 💰 Módulo Financial (Financiero)

### 21. **Fees (Cuotas)** 💵

**Base:** `/api/fees`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/fees` | Listar todas las cuotas | - |
| GET | `/api/fees/:id` | Obtener una cuota por ID | - |
| POST | `/api/fees` | Crear una nueva cuota | Ver ejemplo ⬇️ |
| PUT | `/api/fees/:id` | Actualizar una cuota | Ver ejemplo ⬇️ |
| DELETE | `/api/fees/:id` | Eliminar una cuota | - |

**Ejemplo POST/PUT:**
```json
{
  "tripId": 1,
  "amount": 500000,
  "description": "Primera cuota del viaje al Caribe",
  "dueDate": "2025-11-30T23:59:59.000Z",
  "status": "pending"
}
```

**Campos:**
- `tripId` (number, required): ID del viaje asociado
- `amount` (number, required): Monto de la cuota en pesos
- `description` (string, required): Descripción de la cuota
- `dueDate` (datetime, required): Fecha de vencimiento
- `status` (string, required): Estado de la cuota

---

### 22. **Bank Cards (Tarjetas Bancarias)** 💳

**Base:** `/api/bank-cards`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/bank-cards` | Listar todas las tarjetas | - |
| GET | `/api/bank-cards/:id` | Obtener una tarjeta por ID | - |
| POST | `/api/bank-cards` | Crear una nueva tarjeta | Ver ejemplo ⬇️ |
| PUT | `/api/bank-cards/:id` | Actualizar una tarjeta | Ver ejemplo ⬇️ |
| DELETE | `/api/bank-cards/:id` | Eliminar una tarjeta | - |

**Ejemplo POST/PUT:**
```json
{
  "clientId": 1,
  "cardNumber": "4111111111111111",
  "cvv": "123",
  "expirationDate": "2027-12-31T23:59:59.000Z",
  "cardHolderName": "JUAN CARLOS PEREZ GOMEZ"
}
```

**Campos:**
- `clientId` (number, required): ID del cliente propietario
- `cardNumber` (string, required): Número de la tarjeta (máx 19 caracteres)
- `cvv` (string, required): Código CVV (3-4 dígitos)
- `expirationDate` (datetime, required): Fecha de expiración
- `cardHolderName` (string, required): Nombre del titular como aparece en la tarjeta

---

### 23. **Invoices (Facturas)** 🧾

**Base:** `/api/invoices`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/invoices` | Listar todas las facturas | - |
| GET | `/api/invoices/:id` | Obtener una factura por ID | - |
| POST | `/api/invoices` | Crear una nueva factura | Ver ejemplo ⬇️ |
| PUT | `/api/invoices/:id` | Actualizar una factura | Ver ejemplo ⬇️ |
| DELETE | `/api/invoices/:id` | Eliminar una factura | - |

**Ejemplo POST/PUT:**
```json
{
  "feeId": 1,
  "bankCardId": 1,
  "invoiceNumber": "INV-2025-001",
  "totalAmount": 500000,
  "issueDate": "2025-11-17T10:00:00.000Z",
  "paymentDate": "2025-11-17T10:30:00.000Z",
  "paymentMethod": "credit_card"
}
```

**Campos:**
- `feeId` (number, required): ID de la cuota asociada (relación 1:1, único)
- `bankCardId` (number, optional): ID de la tarjeta bancaria utilizada
- `invoiceNumber` (string, required): Número de la factura (único)
- `totalAmount` (number, required): Monto total de la factura en pesos
- `issueDate` (datetime, required): Fecha de emisión de la factura
- `paymentDate` (datetime, optional): Fecha de pago
- `paymentMethod` (string, required): Método de pago utilizado

---

## 🔗 Módulo Pivots (Relaciones)

### 24. **Trip Clients (Clientes en Viajes)** 🚌👥

**Base:** `/api/trip-clients`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/trip-clients` | Listar todas las asociaciones | - |
| GET | `/api/trip-clients/:id` | Obtener una asociación por ID | - |
| POST | `/api/trip-clients` | Asociar cliente a viaje | Ver ejemplo ⬇️ |
| DELETE | `/api/trip-clients/:id` | Desasociar cliente de viaje | - |

**Ejemplo POST:**
```json
{
  "tripId": 1,
  "clientId": 1
}
```

**Campos:**
- `tripId` (number, required): ID del viaje
- `clientId` (number, required): ID del cliente

---

### 25. **Trip Plans (Planes en Viajes)** 🚌📋

**Base:** `/api/trip-plans`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/trip-plans` | Listar todas las asociaciones | - |
| GET | `/api/trip-plans/:id` | Obtener una asociación por ID | - |
| POST | `/api/trip-plans` | Asociar plan a viaje | Ver ejemplo ⬇️ |
| DELETE | `/api/trip-plans/:id` | Desasociar plan de viaje | - |

**Ejemplo POST:**
```json
{
  "tripId": 1,
  "planId": 1
}
```

**Campos:**
- `tripId` (number, required): ID del viaje
- `planId` (number, required): ID del plan

---

## 📊 Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa (GET, PUT, DELETE) |
| 201 | Created | Recurso creado exitosamente (POST) |
| 400 | Bad Request | Datos inválidos en el request |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

---

## 💡 Consejos de Implementación

### 1. **Crear un Viaje Completo**
```javascript
// 1. Crear el viaje
const trip = await fetch('/api/trips', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Tour Caribe",
    description: "Viaje al caribe colombiano",
    price: 1500000,
    capacity: 40,
    availableSeats: 40,
    status: "published",
    startDate: "2025-12-01T08:00:00.000Z",
    endDate: "2025-12-10T18:00:00.000Z",
    destination: "Cartagena"
  })
});

// 2. Asociar clientes
await fetch('/api/trip-clients', {
  method: 'POST',
  body: JSON.stringify({ tripId: trip.id, clientId: 1 })
});

// 3. Asociar planes
await fetch('/api/trip-plans', {
  method: 'POST',
  body: JSON.stringify({ tripId: trip.id, planId: 1 })
});
```

### 2. **Crear un Vehículo con Detalles**
```javascript
// 1. Crear el vehículo base
const vehicle = await fetch('/api/vehicles', {
  method: 'POST',
  body: JSON.stringify({
    licensePlate: "ABC123",
    brand: "Mercedes-Benz",
    model: "Sprinter",
    year: 2024,
    color: "Blanco",
    numberOfSeats: 20,
    vehicleType: "bus",
    status: "active"
  })
});

// 2. Agregar GPS
await fetch('/api/gps', {
  method: 'POST',
  body: JSON.stringify({
    vehicleId: vehicle.id,
    serialNumber: "GPS-2025-001",
    brand: "Garmin",
    model: "Drive 52",
    isActive: true
  })
});

// 3. Si es terrestre, crear Car
await fetch('/api/cars', {
  method: 'POST',
  body: JSON.stringify({
    vehicleId: vehicle.id,
    hotelId: 1,
    fuelType: "diesel",
    transmissionType: "manual"
  })
});
```

### 3. **Manejo de Paginación**
```javascript
const fetchWithPagination = async (page = 1) => {
  const response = await fetch(`/api/trips?page=${page}&per_page=10`);
  const data = await response.json();
  
  console.log(`Página ${data.meta.current_page} de ${data.meta.last_page}`);
  console.log(`Total: ${data.meta.total} viajes`);
  
  return data.data;
};
```

---

## 🔐 Seguridad

**Importante:** En producción, activar el middleware de seguridad en las rutas para requerir autenticación.

---

**Última actualización:** Noviembre 2025  
**Versión:** 2.0.0
