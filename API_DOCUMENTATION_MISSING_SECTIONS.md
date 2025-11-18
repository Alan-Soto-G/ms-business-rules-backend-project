# 📝 Secciones Faltantes para API_DOCUMENTATION.md

## ⚠️ INSTRUCCIONES
Este archivo contiene las secciones COMPLETAS que deben insertarse en API_DOCUMENTATION.md
**Insertar DESPUÉS de la sección "Guides" y ANTES de "Módulo Pivots"**

---

## 🚗 Módulo Transportation (Transporte)

### 11. **Vehicles (Vehículos)** 🚙

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
  "brand": "Toyota",
  "model": "Hiace",
  "year": 2023,
  "color": "Blanco",
  "numberOfSeats": 15,
  "vehicleType": "bus",
  "status": "available"
}
```

**Campos:**
- `licensePlate` (string, required): Placa del vehículo (única, 2-20 caracteres alfanuméricos)
- `brand` (string, required): Marca del vehículo (2-50 caracteres)
- `model` (string, required): Modelo del vehículo (1-50 caracteres)
- `year` (number, required): Año del vehículo (1900-2100)
- `color` (string, required): Color del vehículo (2-30 caracteres)
- `numberOfSeats` (number, required): Número de asientos (1-100)
- `vehicleType` (string, required): Tipo de vehículo (2-50 caracteres)
- `status` (string, optional): Estado: 'available' | 'in_use' | 'maintenance' | 'retired' (default: 'available')

---

### 12. **Airlines (Aerolíneas)** ✈️

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
- `codeIata` (string, required): Código IATA (2 letras, único)
- `codeIcao` (string, required): Código ICAO (3 letras, único)
- `countryOfOrigin` (string, required): País de origen
- `isActive` (boolean, optional): Está activa (default: true)

---

### 13. **Aircrafts (Aeronaves)** 🛩️

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
- `vehicleId` (number, required): ID del vehículo base (único, 1 a 1)
- `airlineId` (number, required): ID de la aerolínea
- `registrationCountry` (string, required): País de registro
- `maxAltitude` (number, optional): Altitud máxima en metros

**Relaciones:**
- **1:1 con Vehicle:** Un aircraft ES un vehicle especializado
- **N:1 con Airline:** Una aeronave pertenece a una aerolínea

---

### 14. **Cars (Autos)** 🚗

**Base:** `/api/cars`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/cars` | Listar todos los autos | - |
| GET | `/api/cars/:id` | Obtener un auto por ID | - |
| POST | `/api/cars` | Crear un nuevo auto | Ver ejemplo ⬇️ |
| PUT | `/api/cars/:id` | Actualizar un auto | Ver ejemplo ⬇️ |
| DELETE | `/api/cars/:id` | Eliminar un auto | - |

**Ejemplo POST/PUT:**
```json
{
  "vehicleId": 2,
  "hotelId": 1,
  "carType": "sedan",
  "hasAirConditioning": true,
  "fuelType": "gasoline"
}
```

**Campos:**
- `vehicleId` (number, required): ID del vehículo base (único, 1 a 1)
- `hotelId` (number, required): ID del hotel al que pertenece
- `carType` (string, required): Tipo: 'sedan' | 'suv' | 'van' | 'luxury'
- `hasAirConditioning` (boolean, optional): Tiene aire acondicionado (default: false)
- `fuelType` (string, required): Tipo de combustible: 'gasoline' | 'diesel' | 'electric' | 'hybrid'

**Relaciones:**
- **1:1 con Vehicle:** Un car ES un vehicle especializado
- **N:1 con Hotel:** Un auto pertenece a un hotel

---

### 15. **GPS** 📍

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
  "model": "Fleet 790",
  "isActive": true
}
```

**Campos:**
- `vehicleId` (number, required): ID del vehículo (único, 1 a 1)
- `serialNumber` (string, required): Número de serie del GPS (único, 5-50 caracteres)
- `brand` (string, required): Marca del GPS (2-100 caracteres)
- `model` (string, required): Modelo del GPS (1-100 caracteres)
- `isActive` (boolean, optional): GPS activo (default: true)

**Relaciones:**
- **1:1 con Vehicle:** Un GPS pertenece a un solo vehículo

**Casos de Uso:**
- 🗺️ Registro de dispositivos GPS en vehículos
- 📊 Control de inventario de equipos
- ⚙️ Gestión de dispositivos activos/inactivos
- 🔧 Mantenimiento de equipos GPS

---

### 16. **Journeys (Trayectos)** 🗺️

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
  "distance": 450,
  "estimatedDuration": 360,
  "description": "Ruta directa por autopista"
}
```

**Campos:**
- `originMunicipalityId` (number, required): ID del municipio de origen
- `destinationMunicipalityId` (number, required): ID del municipio de destino (debe ser diferente al origen)
- `distance` (number, required): Distancia en kilómetros
- `estimatedDuration` (number, optional): Duración estimada en minutos
- `description` (string, optional): Descripción de la ruta

**Relaciones:**
- **N:1 con Municipality (origen):** Trayectos que salen de un municipio
- **N:1 con Municipality (destino):** Trayectos que llegan a un municipio

**Validaciones:**
- ✅ El origen debe ser diferente del destino
- ✅ La distancia debe ser mayor a 0

---

### 17. **Transportation Services (Servicios de Transporte)** 🚌

**Base:** `/api/transportation-services`

Gestiona la relación **N a N** entre Journeys (trayectos) y Vehicles (vehículos) con información adicional de fechas y costo.

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/transportation-services` | Listar todos los servicios | - |
| GET | `/api/transportation-services/:id` | Obtener un servicio por ID | - |
| GET | `/api/transportation-services/journey/:journeyId` | Servicios de un trayecto | - |
| GET | `/api/transportation-services/vehicle/:vehicleId` | Servicios de un vehículo | - |
| POST | `/api/transportation-services` | Crear servicio | Ver ejemplo ⬇️ |
| POST | `/api/transportation-services/assign` | Asignar vehículo a trayecto | Ver ejemplo ⬇️ |
| DELETE | `/api/transportation-services/unassign/:journeyId/:vehicleId` | Desasignar vehículo | - |
| PUT | `/api/transportation-services/:id` | Actualizar servicio | Ver ejemplo ⬇️ |
| DELETE | `/api/transportation-services/:id` | Eliminar servicio | - |

**Ejemplo POST/PUT:**
```json
{
  "journeyId": 1,
  "vehicleId": 1,
  "startDate": "2025-12-01T08:00:00.000Z",
  "endDate": "2025-12-01T14:00:00.000Z",
  "cost": 150000
}
```

**Campos:**
- `journeyId` (number, required): ID del trayecto
- `vehicleId` (number, required): ID del vehículo
- `startDate` (datetime, required): Fecha y hora de inicio
- `endDate` (datetime, required): Fecha y hora de finalización (debe ser posterior a startDate)
- `cost` (number, required): Costo del servicio en pesos

**Validaciones:**
- ✅ Valida existencia del journey
- ✅ Valida existencia del vehicle
- ✅ endDate debe ser posterior a startDate
- ✅ Previene duplicados (mismo journey + vehicle + startDate)

**Casos de Uso:**
- 🚌 Programación de servicios de transporte
- 💰 Cálculo de costos operativos
- 📊 Gestión de disponibilidad de vehículos
- 🗓️ Planificación de rutas

---

### 18. **Transport Itineraries (Itinerarios de Transporte)** 🗓️

**Base:** `/api/transport-itineraries`

Conecta Trips con Journeys, definiendo el itinerario secuencial de un viaje.

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/transport-itineraries` | Listar todos los itinerarios | - |
| GET | `/api/transport-itineraries/:id` | Obtener un itinerario por ID | - |
| POST | `/api/transport-itineraries` | Crear un itinerario | Ver ejemplo ⬇️ |
| PUT | `/api/transport-itineraries/:id` | Actualizar un itinerario | Ver ejemplo ⬇️ |
| DELETE | `/api/transport-itineraries/:id` | Eliminar un itinerario | - |

**Ejemplo POST/PUT:**
```json
{
  "tripId": 1,
  "journeyId": 1,
  "order": 1,
  "scheduledDate": "2025-12-01T08:00:00.000Z"
}
```

**Campos:**
- `tripId` (number, required): ID del viaje
- `journeyId` (number, required): ID del trayecto
- `order` (number, required): Orden en el itinerario (1, 2, 3...)
- `scheduledDate` (datetime, optional): Fecha programada del trayecto

**Relaciones:**
- **N:1 con Trip:** Un viaje tiene múltiples trayectos
- **N:1 con Journey:** Un trayecto puede usarse en múltiples viajes

**Casos de Uso:**
- 🗺️ Definir rutas multi-etapa: Bogotá → Cartagena → Santa Marta → Barranquilla
- 📅 Programar fechas específicas para cada tramo
- 🔢 Ordenar secuencialmente los trayectos del viaje

---

## 💰 Módulo Financial (Financiero)

### 19. **Bank Cards (Tarjetas Bancarias)** 💳

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
  "expirationDate": "2027-12-31",
  "cardHolderName": "Juan Pérez"
}
```

**Campos:**
- `clientId` (number, required): ID del cliente propietario
- `cardNumber` (string, required): Número de tarjeta (16 dígitos, único)
- `cvv` (string, required): Código CVV (3-4 dígitos)
- `expirationDate` (datetime, required): Fecha de vencimiento
- `cardHolderName` (string, required): Nombre del titular

**Relaciones:**
- **N:1 con Client:** Un cliente puede tener múltiples tarjetas
- **1:N con Invoice:** Una tarjeta puede usarse en múltiples pagos

**⚠️ Seguridad:**
- En producción, el CVV NO debe almacenarse
- Usar tokenización con pasarela de pagos
- Encriptar datos sensibles

---

### 20. **Fees (Tarifas/Cuotas)** 💵

**Base:** `/api/fees`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/fees` | Listar todas las tarifas | - |
| GET | `/api/fees/:id` | Obtener una tarifa por ID | - |
| POST | `/api/fees` | Crear una nueva tarifa | Ver ejemplo ⬇️ |
| PUT | `/api/fees/:id` | Actualizar una tarifa | Ver ejemplo ⬇️ |
| DELETE | `/api/fees/:id` | Eliminar una tarifa | - |

**Ejemplo POST/PUT:**
```json
{
  "tripId": 1,
  "amount": 500000,
  "description": "Primera cuota del viaje",
  "dueDate": "2025-11-30T23:59:59.000Z",
  "status": "pending"
}
```

**Campos:**
- `tripId` (number, required): ID del viaje asociado
- `amount` (number, required): Monto de la tarifa en pesos (debe ser positivo)
- `description` (string, required): Descripción de la tarifa
- `dueDate` (datetime, required): Fecha de vencimiento
- `status` (string, required): Estado: 
  - `pending`: Pendiente de pago
  - `paid`: Pagada
  - `overdue`: Vencida
  - `cancelled`: Cancelada
  - `refunded`: Reembolsada

**Relaciones:**
- **N:1 con Trip:** Un viaje puede tener múltiples cuotas
- **1:1 con Invoice:** Una tarifa genera una factura al pagarse

**Casos de Uso:**
- 💰 Sistema de cuotas para viajes
- 📅 Gestión de vencimientos
- 💳 Pagos parciales
- 📊 Control de cartera

---

### 21. **Invoices (Facturas)** 🧾

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
- `feeId` (number, required): ID de la tarifa asociada (único, 1 a 1)
- `bankCardId` (number, optional): ID de la tarjeta usada para pago
- `invoiceNumber` (string, required): Número de factura (único, secuencial)
- `totalAmount` (number, required): Monto total en pesos
- `issueDate` (datetime, required): Fecha de emisión
- `paymentDate` (datetime, optional): Fecha de pago (null si no pagada)
- `paymentMethod` (string, required): Método de pago:
  - `credit_card`: Tarjeta de crédito
  - `debit_card`: Tarjeta débito
  - `cash`: Efectivo
  - `bank_transfer`: Transferencia bancaria
  - `paypal`: PayPal
  - `other`: Otro método

**Relaciones:**
- **1:1 con Fee:** Una factura corresponde a una tarifa
- **N:1 con BankCard:** Una tarjeta puede usarse en múltiples facturas

**Validaciones:**
- ✅ El invoiceNumber debe ser único
- ✅ totalAmount debe ser positivo
- ✅ paymentDate debe ser posterior a issueDate (si existe)

**Casos de Uso:**
- 🧾 Generación de comprobantes de pago
- 📊 Contabilidad y reportes financieros
- 💳 Rastreo de métodos de pago
- 📧 Envío de facturas por email

---

## 📊 Resumen de Entidades por Módulo

| Módulo | Cantidad | Entidades |
|--------|----------|-----------|
| **Core** | 4 | Trips, Clients, Plans, Municipalities |
| **Accommodation** | 4 | Hotels, Rooms, Hotel Admins, Bookings |
| **Tourism** | 2 | Tourist Activities, Guides |
| **Transportation** | 8 | Vehicles, Airlines, Aircrafts, Cars, GPS, Journeys, Transportation Services, Transport Itineraries |
| **Financial** | 3 | Bank Cards, Fees, Invoices |
| **Pivots** | 5 | Guide Activities, Plan Activities, Trip Plans, Trip Clients, Bookings |
| **TOTAL** | **26** | - |

---

## 🔗 Mapa de Relaciones Principales

### Jerarquía de Herencia (Especialización)
```
Vehicle (base)
├── Aircraft (1:1) ──→ Airline (N:1)
├── Car (1:1) ──→ Hotel (N:1)
└── GPS (1:1)
```

### Transporte
```
Municipality ←─(N:1)─ Journey ←─(N:N)─ Transportation Service ─(N:N)─→ Vehicle
                        ↓
                  Transport Itinerary ─(N:1)─→ Trip
```

### Financiero
```
Client ─(1:N)─→ BankCard ─(1:N)─→ Invoice ─(1:1)─→ Fee ─(N:1)─→ Trip
```

### Turismo
```
Municipality ─(1:N)─→ TouristActivity ←─(N:N)─ GuideActivity ─(N:N)─→ Guide
                                        ↓
                                  PlanActivity ─(N:N)─→ Plan ─(N:N)─→ Trip
```

---

**✅ Este archivo completa la documentación con las 11 entidades faltantes**
**📌 Insertar estas secciones entre "Guides" y "Módulo Pivots" en el archivo original**
