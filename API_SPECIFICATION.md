# Especificación API - Microservicio de Reglas de Negocio

## Información General

### URL Base

```
http://localhost:<PORT>/api
```

> **Nota**: El puerto se define en la variable de entorno `PORT`

### Formato de Respuesta Estándar

Todas las respuestas del API siguen esta estructura:

#### Respuesta Exitosa

```typescript
{
  message: string;
  data: T | T[] | { meta: PaginationMeta, data: T[] };
}
```

#### Respuesta de Error

```typescript
{
  message: string;
  error?: string;
  errors?: ValidationError[];
}
```

### Códigos de Estado HTTP

- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error de validación
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej: duplicado)
- `500 Internal Server Error` - Error interno del servidor

### Paginación

Parámetros de query opcionales para endpoints que soportan paginación:

- `page` (number) - Número de página
- `limit` (number) - Cantidad de elementos por página

---

## 1. ACCOMMODATION (Alojamiento)

### 1.1 Hotels (Hoteles)

#### Endpoints

| Método | Ruta          | Descripción               |
| ------ | ------------- | ------------------------- |
| GET    | `/hotels`     | Obtener todos los hoteles |
| GET    | `/hotels/:id` | Obtener un hotel por ID   |
| POST   | `/hotels`     | Crear un nuevo hotel      |
| PUT    | `/hotels/:id` | Actualizar un hotel       |
| DELETE | `/hotels/:id` | Eliminar un hotel         |

#### Modelo de Datos

```typescript
interface Hotel {
  id: number
  hotelAdminId: number
  municipalityId: number
  name: string
  address: string
  phone: string
  email: string
  starRating: number
  status: 'active' | 'inactive' | 'under_renovation'
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Hotel (POST `/hotels`)

**Request Body:**

```typescript
{
  hotelAdminId: number;        // Required, positive integer
  municipalityId: number;      // Required, positive integer
  name: string;                // Required, 3-150 chars
  address: string;             // Required, min 10 chars
  phone: string;               // Required, 7-20 chars
  email: string;               // Required, valid email, max 100 chars
  starRating?: number;         // Optional, 0-5 (integer)
  status?: 'active' | 'inactive' | 'under_renovation'; // Optional
}
```

**Responses:**

- `201 Created` - Hotel creado exitosamente
- `400 Bad Request` - Error de validación
- `404 Not Found` - Hotel admin o municipalidad no encontrados (código: 23503)
- `500 Internal Server Error` - Error interno

#### Actualizar Hotel (PUT `/hotels/:id`)

**Request Body:** (todos los campos opcionales)

```typescript
{
  hotelAdminId?: number;
  municipalityId?: number;
  name?: string;              // 3-150 chars
  address?: string;           // min 10 chars
  phone?: string;             // 7-20 chars
  email?: string;             // valid email, max 100 chars
  starRating?: number;        // 0-5 (integer)
  status?: 'active' | 'inactive' | 'under_renovation';
}
```

**Responses:**

- `200 OK` - Hotel actualizado
- `400 Bad Request` - Error de validación
- `404 Not Found` - Hotel no encontrado o referencia inválida
- `500 Internal Server Error` - Error interno

---

### 1.2 Rooms (Habitaciones)

#### Endpoints

| Método | Ruta         | Descripción                    |
| ------ | ------------ | ------------------------------ |
| GET    | `/rooms`     | Obtener todas las habitaciones |
| GET    | `/rooms/:id` | Obtener una habitación por ID  |
| POST   | `/rooms`     | Crear una nueva habitación     |
| PUT    | `/rooms/:id` | Actualizar una habitación      |
| DELETE | `/rooms/:id` | Eliminar una habitación        |

#### Modelo de Datos

```typescript
interface Room {
  id: number
  hotelId: number
  roomNumber: string
  roomType: string
  capacity: number
  pricePerNight: number
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning'
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Room (POST `/rooms`)

**Request Body:**

```typescript
{
  hotelId: number;            // Required, positive integer
  roomNumber: string;         // Required, 1-20 chars
  roomType: string;           // Required, 3-50 chars
  capacity: number;           // Required, 1-20 (integer)
  pricePerNight: number;      // Required, positive, max 2 decimals
  status?: 'available' | 'occupied' | 'maintenance' | 'cleaning'; // Optional
}
```

**Responses:**

- `201 Created` - Habitación creada
- `400 Bad Request` - Error de validación
- `404 Not Found` - Hotel no encontrado (código: 23503)
- `409 Conflict` - Número de habitación duplicado en ese hotel (código: 23505)
- `500 Internal Server Error` - Error interno

#### Actualizar Room (PUT `/rooms/:id`)

**Request Body:** (todos los campos opcionales)

```typescript
{
  hotelId?: number;
  roomNumber?: string;        // 1-20 chars
  roomType?: string;          // 3-50 chars
  capacity?: number;          // 1-20 (integer)
  pricePerNight?: number;     // positive, max 2 decimals
  status?: 'available' | 'occupied' | 'maintenance' | 'cleaning';
}
```

---

### 1.3 Hotel Admins (Administradores de Hotel)

#### Endpoints

| Método | Ruta                | Descripción                       |
| ------ | ------------------- | --------------------------------- |
| GET    | `/hotel-admins`     | Obtener todos los administradores |
| GET    | `/hotel-admins/:id` | Obtener un administrador por ID   |
| POST   | `/hotel-admins`     | Crear un nuevo administrador      |
| PUT    | `/hotel-admins/:id` | Actualizar un administrador       |
| DELETE | `/hotel-admins/:id` | Eliminar un administrador         |

#### Modelo de Datos

```typescript
interface HotelAdmin {
  id: number
  userId: string
  isVerified: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Hotel Admin (POST `/hotel-admins`)

**Request Body:**

```typescript
{
  userId: string;             // Required, 1-100 chars
  isVerified?: boolean;       // Optional, default: false
}
```

#### Actualizar Hotel Admin (PUT `/hotel-admins/:id`)

**Request Body:**

```typescript
{
  userId?: string;            // 1-100 chars
  isVerified?: boolean;
}
```

---

### 1.4 Bookings (Reservas)

#### Endpoints

| Método | Ruta                                 | Descripción                      |
| ------ | ------------------------------------ | -------------------------------- |
| GET    | `/bookings`                          | Obtener todas las reservas       |
| GET    | `/bookings/:id`                      | Obtener una reserva por ID       |
| GET    | `/bookings/trip/:tripId`             | Obtener reservas por viaje       |
| GET    | `/bookings/room/:roomId`             | Obtener reservas por habitación  |
| POST   | `/bookings`                          | Crear una nueva reserva          |
| POST   | `/bookings/assign`                   | Asignar habitación a viaje       |
| PUT    | `/bookings/:id`                      | Actualizar una reserva           |
| PATCH  | `/bookings/:id`                      | Actualizar una reserva (parcial) |
| DELETE | `/bookings/:id`                      | Eliminar una reserva             |
| DELETE | `/bookings/unassign/:tripId/:roomId` | Desasignar habitación de viaje   |

#### Modelo de Datos

```typescript
interface Booking {
  id: number
  tripId: number
  roomId: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Booking (POST `/bookings`)

**Request Body:**

```typescript
{
  trip_id: number // Required, positive integer
  room_id: number // Required, positive integer
}
```

#### Asignar Booking (POST `/bookings/assign`)

**Request Body:**

```typescript
{
  trip_id: number // Required, positive integer
  room_id: number // Required, positive integer
}
```

#### Actualizar Booking (PUT/PATCH `/bookings/:id`)

**Request Body:**

```typescript
{
  trip_id?: number;           // Optional, positive integer
  room_id?: number;           // Optional, positive integer
}
```

---

## 2. CORE (Núcleo)

### 2.1 Municipalities (Municipios)

#### Endpoints

| Método | Ruta                  | Descripción                  |
| ------ | --------------------- | ---------------------------- |
| GET    | `/municipalities`     | Obtener todos los municipios |
| GET    | `/municipalities/:id` | Obtener un municipio por ID  |
| POST   | `/municipalities`     | Crear un nuevo municipio     |
| PUT    | `/municipalities/:id` | Actualizar un municipio      |
| DELETE | `/municipalities/:id` | Eliminar un municipio        |

#### Modelo de Datos

```typescript
interface Municipality {
  id: number
  name: string
  department: string
  code: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Municipality (POST `/municipalities`)

**Request Body:**

```typescript
{
  name: string // Required, 2-100 chars
  department: string // Required, 2-100 chars
  code: string // Required, 2-20 chars
}
```

#### Actualizar Municipality (PUT `/municipalities/:id`)

**Request Body:**

```typescript
{
  name?: string;              // 2-100 chars
  department?: string;        // 2-100 chars
  code?: string;              // 2-20 chars
}
```

---

### 2.2 Clients (Clientes)

#### Endpoints

| Método | Ruta           | Descripción                |
| ------ | -------------- | -------------------------- |
| GET    | `/clients`     | Obtener todos los clientes |
| GET    | `/clients/:id` | Obtener un cliente por ID  |
| POST   | `/clients`     | Crear un nuevo cliente     |
| PUT    | `/clients/:id` | Actualizar un cliente      |
| DELETE | `/clients/:id` | Eliminar un cliente        |

#### Modelo de Datos

```typescript
interface Client {
  id: number
  userId: string
  emergencyContactName: string | null
  emergencyContactPhone: string | null
  allergies: string | null
  loyaltyPoints: number
  isVip: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Client (POST `/clients`)

**Request Body:**

```typescript
{
  userId: string;                    // Required, 1-100 chars
  emergencyContactName?: string;     // Optional, 3-100 chars
  emergencyContactPhone?: string;    // Optional, 7-20 chars
  allergies?: string;                // Optional
  loyaltyPoints?: number;            // Optional, min 0 (integer)
  isVip?: boolean;                   // Optional, default: false
}
```

#### Actualizar Client (PUT `/clients/:id`)

**Request Body:** (todos los campos opcionales)

```typescript
{
  userId?: string;                   // 1-100 chars
  emergencyContactName?: string;     // 3-100 chars
  emergencyContactPhone?: string;    // 7-20 chars
  allergies?: string;
  loyaltyPoints?: number;            // min 0 (integer)
  isVip?: boolean;
}
```

---

### 2.3 Plans (Planes)

#### Endpoints

| Método | Ruta         | Descripción              |
| ------ | ------------ | ------------------------ |
| GET    | `/plans`     | Obtener todos los planes |
| GET    | `/plans/:id` | Obtener un plan por ID   |
| POST   | `/plans`     | Crear un nuevo plan      |
| PUT    | `/plans/:id` | Actualizar un plan       |
| DELETE | `/plans/:id` | Eliminar un plan         |

#### Modelo de Datos

```typescript
interface Plan {
  id: number
  name: string
  description: string | null
  price: number
  duration: number | null
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Plan (POST `/plans`)

**Request Body:**

```typescript
{
  name: string;               // Required, 3-150 chars
  description?: string;       // Optional
  price: number;              // Required, positive, max 2 decimals
  duration?: number;          // Optional, 1-365 days (integer)
}
```

#### Actualizar Plan (PUT `/plans/:id`)

**Request Body:**

```typescript
{
  name?: string;              // 3-150 chars
  description?: string;
  price?: number;             // positive, max 2 decimals
  duration?: number;          // 1-365 days (integer)
}
```

---

### 2.4 Trips (Viajes)

#### Endpoints

| Método | Ruta         | Descripción              |
| ------ | ------------ | ------------------------ |
| GET    | `/trips`     | Obtener todos los viajes |
| GET    | `/trips/:id` | Obtener un viaje por ID  |
| POST   | `/trips`     | Crear un nuevo viaje     |
| PUT    | `/trips/:id` | Actualizar un viaje      |
| DELETE | `/trips/:id` | Eliminar un viaje        |

#### Modelo de Datos

```typescript
interface Trip {
  id: number
  name: string
  description: string | null
  destination: string
  startDate: DateTime
  endDate: DateTime
  price: number
  capacity: number
  availableSeats: number
  status: 'draft' | 'published' | 'active' | 'full' | 'completed' | 'cancelled'
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Trip (POST `/trips`)

**Request Body:**

```typescript
{
  name: string;                      // Required, 3-150 chars
  description?: string;              // Optional
  destination: string;               // Required, 3-150 chars
  startDate: Date;                   // Required, ISO 8601 format
  endDate: Date;                     // Required, ISO 8601 format
  price: number;                     // Required, positive, max 2 decimals
  capacity: number;                  // Required, 1-500 (integer)
  availableSeats: number;            // Required, min 0 (integer)
  status?: 'draft' | 'published' | 'active' | 'full' | 'completed' | 'cancelled';
}
```

#### Actualizar Trip (PUT `/trips/:id`)

**Request Body:** (todos los campos opcionales)

```typescript
{
  name?: string;                     // 3-150 chars
  description?: string;
  destination?: string;              // 3-150 chars
  startDate?: Date;                  // ISO 8601 format
  endDate?: Date;                    // ISO 8601 format
  price?: number;                    // positive, max 2 decimals
  capacity?: number;                 // 1-500 (integer)
  availableSeats?: number;           // min 0 (integer)
  status?: 'draft' | 'published' | 'active' | 'full' | 'completed' | 'cancelled';
}
```

---

## 3. FINANCIAL (Financiero)

### 3.1 Bank Cards (Tarjetas Bancarias)

#### Endpoints

| Método | Ruta              | Descripción                |
| ------ | ----------------- | -------------------------- |
| GET    | `/bank-cards`     | Obtener todas las tarjetas |
| GET    | `/bank-cards/:id` | Obtener una tarjeta por ID |
| POST   | `/bank-cards`     | Crear una nueva tarjeta    |
| PUT    | `/bank-cards/:id` | Actualizar una tarjeta     |
| DELETE | `/bank-cards/:id` | Eliminar una tarjeta       |

#### Modelo de Datos

```typescript
interface BankCard {
  id: number
  clientId: number
  cardNumber: string
  cvv: string
  expirationDate: DateTime
  cardHolderName: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Bank Card (POST `/bank-cards`)

**Request Body:**

```typescript
{
  clientId: number // Required, positive
  cardNumber: string // Required, 13-16 digits only
  cvv: string // Required, 3-4 digits only
  expirationDate: Date // Required, ISO 8601 format
  cardHolderName: string // Required, 3-255 chars
}
```

**Validaciones especiales:**

- `cardNumber`: Solo dígitos, 13-16 caracteres
- `cvv`: Solo dígitos, 3-4 caracteres
- `expirationDate`: Formato de fecha válido

#### Actualizar Bank Card (PUT `/bank-cards/:id`)

**Request Body:** (todos los campos opcionales)

```typescript
{
  clientId?: number;
  cardNumber?: string;        // 13-16 digits only
  cvv?: string;               // 3-4 digits only
  expirationDate?: Date;      // ISO 8601 format
  cardHolderName?: string;    // 3-255 chars
}
```

---

### 3.2 Fees (Cuotas)

#### Endpoints

| Método | Ruta        | Descripción              |
| ------ | ----------- | ------------------------ |
| GET    | `/fees`     | Obtener todas las cuotas |
| GET    | `/fees/:id` | Obtener una cuota por ID |
| POST   | `/fees`     | Crear una nueva cuota    |
| PUT    | `/fees/:id` | Actualizar una cuota     |
| DELETE | `/fees/:id` | Eliminar una cuota       |

#### Modelo de Datos

```typescript
interface Fee {
  id: number
  tripId: number
  amount: number
  description: string
  dueDate: DateTime
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded'
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Fee (POST `/fees`)

**Request Body:**

```typescript
{
  tripId: number;             // Required, positive integer
  amount: number;             // Required, positive, max 2 decimals
  description: string;        // Required, 3-255 chars
  dueDate: Date;              // Required, ISO 8601 format
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded'; // Optional
}
```

#### Actualizar Fee (PUT `/fees/:id`)

**Request Body:**

```typescript
{
  tripId?: number;
  amount?: number;            // positive, max 2 decimals
  description?: string;       // 3-255 chars
  dueDate?: Date;             // ISO 8601 format
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
}
```

---

### 3.3 Invoices (Facturas)

#### Endpoints

| Método | Ruta            | Descripción                |
| ------ | --------------- | -------------------------- |
| GET    | `/invoices`     | Obtener todas las facturas |
| GET    | `/invoices/:id` | Obtener una factura por ID |
| POST   | `/invoices`     | Crear una nueva factura    |
| PUT    | `/invoices/:id` | Actualizar una factura     |
| DELETE | `/invoices/:id` | Eliminar una factura       |

#### Modelo de Datos

```typescript
interface Invoice {
  id: number
  feeId: number
  bankCardId: number | null
  invoiceNumber: string
  totalAmount: number
  issueDate: DateTime
  paymentDate: DateTime | null
  paymentMethod: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'paypal' | 'other'
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Invoice (POST `/invoices`)

**Request Body:**

```typescript
{
  feeId: number;              // Required, positive integer
  bankCardId?: number | null; // Optional, positive integer or null
  invoiceNumber: string;      // Required, 3-50 chars
  totalAmount: number;        // Required, positive, max 2 decimals
  issueDate: Date;            // Required, ISO 8601 format
  paymentDate?: Date | null;  // Optional, ISO 8601 format or null
  paymentMethod?: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'paypal' | 'other';
}
```

#### Actualizar Invoice (PUT `/invoices/:id`)

**Request Body:** (todos los campos opcionales)

```typescript
{
  feeId?: number;
  bankCardId?: number | null;
  invoiceNumber?: string;     // 3-50 chars
  totalAmount?: number;       // positive, max 2 decimals
  issueDate?: Date;           // ISO 8601 format
  paymentDate?: Date | null;  // ISO 8601 format or null
  paymentMethod?: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'paypal' | 'other';
}
```

---

## 4. TOURISM (Turismo)

### 4.1 Guides (Guías)

#### Endpoints

| Método | Ruta          | Descripción             |
| ------ | ------------- | ----------------------- |
| GET    | `/guides`     | Obtener todos los guías |
| GET    | `/guides/:id` | Obtener un guía por ID  |
| POST   | `/guides`     | Crear un nuevo guía     |
| PUT    | `/guides/:id` | Actualizar un guía      |
| DELETE | `/guides/:id` | Eliminar un guía        |

#### Modelo de Datos

```typescript
interface Guide {
  id: number
  userId: string
  licenseNumber: string
  specialties: string | null
  rating: number
  isAvailable: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Guide (POST `/guides`)

**Request Body:**

```typescript
{
  userId: string;             // Required, 1-100 chars
  licenseNumber: string;      // Required, 3-50 chars
  specialties?: string;       // Optional
  rating?: number;            // Optional, 0-5, max 2 decimals
  isAvailable?: boolean;      // Optional, default: true
}
```

#### Actualizar Guide (PUT `/guides/:id`)

**Request Body:**

```typescript
{
  userId?: string;            // 1-100 chars
  licenseNumber?: string;     // 3-50 chars
  specialties?: string;
  rating?: number;            // 0-5, max 2 decimals
  isAvailable?: boolean;
}
```

---

### 4.2 Tourist Activities (Actividades Turísticas)

#### Endpoints

| Método | Ruta                      | Descripción                   |
| ------ | ------------------------- | ----------------------------- |
| GET    | `/tourist-activities`     | Obtener todas las actividades |
| GET    | `/tourist-activities/:id` | Obtener una actividad por ID  |
| POST   | `/tourist-activities`     | Crear una nueva actividad     |
| PUT    | `/tourist-activities/:id` | Actualizar una actividad      |
| DELETE | `/tourist-activities/:id` | Eliminar una actividad        |

#### Modelo de Datos

```typescript
interface TouristActivity {
  id: number
  municipalityId: number
  name: string
  description: string | null
  price: number | null
  duration: number | null
  category:
    | 'cultural'
    | 'adventure'
    | 'gastronomic'
    | 'recreational'
    | 'ecological'
    | 'aquatic'
    | 'other'
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Tourist Activity (POST `/tourist-activities`)

**Request Body:**

```typescript
{
  municipalityId: number;     // Required, positive integer
  name: string;               // Required, 3-150 chars
  description?: string;       // Optional
  price?: number | null;      // Optional, positive, max 2 decimals, nullable
  duration?: number | null;   // Optional, 1-480 minutes (integer), nullable
  category?: 'cultural' | 'adventure' | 'gastronomic' | 'recreational' | 'ecological' | 'aquatic' | 'other';
}
```

#### Actualizar Tourist Activity (PUT `/tourist-activities/:id`)

**Request Body:**

```typescript
{
  municipalityId?: number;
  name?: string;              // 3-150 chars
  description?: string;
  price?: number | null;      // positive, max 2 decimals, nullable
  duration?: number | null;   // 1-480 minutes (integer), nullable
  category?: 'cultural' | 'adventure' | 'gastronomic' | 'recreational' | 'ecological' | 'aquatic' | 'other';
}
```

---

### 4.3 Guide Activities (Asignación Guía-Actividad)

#### Endpoints

| Método | Ruta                                              | Descripción                         |
| ------ | ------------------------------------------------- | ----------------------------------- |
| GET    | `/guide-activities`                               | Obtener todas las asignaciones      |
| GET    | `/guide-activities/:id`                           | Obtener una asignación por ID       |
| GET    | `/guide-activities/guide/:guideId`                | Obtener asignaciones por guía       |
| GET    | `/guide-activities/activity/:activityId`          | Obtener asignaciones por actividad  |
| POST   | `/guide-activities`                               | Crear una nueva asignación          |
| POST   | `/guide-activities/assign`                        | Asignar guía a actividad            |
| PUT    | `/guide-activities/:id`                           | Actualizar una asignación           |
| PATCH  | `/guide-activities/:id`                           | Actualizar una asignación (parcial) |
| DELETE | `/guide-activities/:id`                           | Eliminar una asignación             |
| DELETE | `/guide-activities/unassign/:guideId/:activityId` | Desasignar guía de actividad        |

#### Modelo de Datos

```typescript
interface GuideActivity {
  id: number
  guideId: number
  activityId: number
  assignmentDate: DateTime | null
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear/Asignar Guide Activity (POST `/guide-activities` o `/guide-activities/assign`)

**Request Body:**

```typescript
{
  guide_id: number;           // Required, positive integer
  activity_id: number;        // Required, positive integer
  assignment_date?: Date;     // Optional, ISO 8601 format
}
```

#### Actualizar Guide Activity (PUT/PATCH `/guide-activities/:id`)

**Request Body:**

```typescript
{
  guide_id?: number;
  activity_id?: number;
  assignment_date?: Date;     // ISO 8601 format
}
```

---

### 4.4 Plan Activities (Asignación Plan-Actividad)

#### Endpoints

| Método | Ruta                                            | Descripción                         |
| ------ | ----------------------------------------------- | ----------------------------------- |
| GET    | `/plan-activities`                              | Obtener todas las asignaciones      |
| GET    | `/plan-activities/:id`                          | Obtener una asignación por ID       |
| GET    | `/plan-activities/plan/:planId`                 | Obtener asignaciones por plan       |
| GET    | `/plan-activities/activity/:activityId`         | Obtener asignaciones por actividad  |
| POST   | `/plan-activities`                              | Crear una nueva asignación          |
| POST   | `/plan-activities/assign`                       | Asignar actividad a plan            |
| PUT    | `/plan-activities/:id`                          | Actualizar una asignación           |
| PATCH  | `/plan-activities/:id`                          | Actualizar una asignación (parcial) |
| DELETE | `/plan-activities/:id`                          | Eliminar una asignación             |
| DELETE | `/plan-activities/unassign/:planId/:activityId` | Desasignar actividad de plan        |

#### Modelo de Datos

```typescript
interface PlanActivity {
  id: number
  planId: number
  activityId: number
  order: number | null
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear/Asignar Plan Activity (POST `/plan-activities` o `/plan-activities/assign`)

**Request Body:**

```typescript
{
  plan_id: number;            // Required, positive integer
  activity_id: number;        // Required, positive integer
  order?: number;             // Optional, positive integer
}
```

#### Actualizar Plan Activity (PUT/PATCH `/plan-activities/:id`)

**Request Body:**

```typescript
{
  plan_id?: number;
  activity_id?: number;
  order?: number;             // positive integer
}
```

---

## 5. TRANSPORTATION (Transporte)

### 5.1 Vehicles (Vehículos)

#### Endpoints

| Método | Ruta            | Descripción                 |
| ------ | --------------- | --------------------------- |
| GET    | `/vehicles`     | Obtener todos los vehículos |
| GET    | `/vehicles/:id` | Obtener un vehículo por ID  |
| POST   | `/vehicles`     | Crear un nuevo vehículo     |
| PUT    | `/vehicles/:id` | Actualizar un vehículo      |
| DELETE | `/vehicles/:id` | Eliminar un vehículo        |

#### Modelo de Datos

```typescript
interface Vehicle {
  id: number
  licensePlate: string
  brand: string
  model: string
  year: number
  color: string
  numberOfSeats: number
  vehicleType: string
  status: 'available' | 'in_use' | 'maintenance' | 'retired'
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Vehicle (POST `/vehicles`)

**Request Body:**

```typescript
{
  licensePlate: string;       // Required, 2-20 chars, uppercase, alphanumeric + hyphen, unique
  brand: string;              // Required, 2-50 chars
  model: string;              // Required, 1-50 chars
  year: number;               // Required, 1900-2100
  color: string;              // Required, 2-30 chars
  numberOfSeats: number;      // Required, 1-100 (integer)
  vehicleType: string;        // Required, 2-50 chars
  status?: 'available' | 'in_use' | 'maintenance' | 'retired'; // Optional
}
```

**Validaciones especiales:**

- `licensePlate`: Patrón `/^[A-Z0-9-]{2,20}$/`, se convierte automáticamente a mayúsculas, debe ser único

#### Actualizar Vehicle (PUT `/vehicles/:id`)

**Request Body:** (todos los campos opcionales)

```typescript
{
  licensePlate?: string;      // 2-20 chars, uppercase, alphanumeric + hyphen
  brand?: string;             // 2-50 chars
  model?: string;             // 1-50 chars
  year?: number;              // 1900-2100
  color?: string;             // 2-30 chars
  numberOfSeats?: number;     // 1-100 (integer)
  vehicleType?: string;       // 2-50 chars
  status?: 'available' | 'in_use' | 'maintenance' | 'retired';
}
```

---

### 5.2 Airlines (Aerolíneas)

#### Endpoints

| Método | Ruta            | Descripción                  |
| ------ | --------------- | ---------------------------- |
| GET    | `/airlines`     | Obtener todas las aerolíneas |
| GET    | `/airlines/:id` | Obtener una aerolínea por ID |
| POST   | `/airlines`     | Crear una nueva aerolínea    |
| PUT    | `/airlines/:id` | Actualizar una aerolínea     |
| DELETE | `/airlines/:id` | Eliminar una aerolínea       |

#### Modelo de Datos

```typescript
interface Airline {
  id: number
  name: string
  codeIata: string
  codeIcao: string
  countryOfOrigin: string
  isActive: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Airline (POST `/airlines`)

**Request Body:**

```typescript
{
  name: string;               // Required, 3-255 chars
  codeIata: string;           // Required, exactly 2 chars, uppercase, unique
  codeIcao: string;           // Required, exactly 3 chars, uppercase, unique
  countryOfOrigin: string;    // Required, 2-100 chars
  isActive?: boolean;         // Optional, default: true
}
```

**Validaciones especiales:**

- `codeIata`: Exactamente 2 caracteres, se convierte a mayúsculas, debe ser único
- `codeIcao`: Exactamente 3 caracteres, se convierte a mayúsculas, debe ser único

#### Actualizar Airline (PUT `/airlines/:id`)

**Request Body:**

```typescript
{
  name?: string;              // 3-255 chars
  codeIata?: string;          // exactly 2 chars, uppercase
  codeIcao?: string;          // exactly 3 chars, uppercase
  countryOfOrigin?: string;   // 2-100 chars
  isActive?: boolean;
}
```

---

### 5.3 Aircrafts (Aeronaves)

#### Endpoints

| Método | Ruta             | Descripción                 |
| ------ | ---------------- | --------------------------- |
| GET    | `/aircrafts`     | Obtener todas las aeronaves |
| GET    | `/aircrafts/:id` | Obtener una aeronave por ID |
| POST   | `/aircrafts`     | Crear una nueva aeronave    |
| PUT    | `/aircrafts/:id` | Actualizar una aeronave     |
| DELETE | `/aircrafts/:id` | Eliminar una aeronave       |

#### Modelo de Datos

```typescript
interface Aircraft {
  id: number
  vehicleId: number
  airlineId: number
  registrationCountry: string
  maxAltitude: number | null
  // Inherited from Vehicle
  licensePlate: string
  brand: string
  model: string
  year: number
  color: string
  numberOfSeats: number
  vehicleType: string
  status: 'available' | 'in_use' | 'maintenance' | 'retired'
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Aircraft (POST `/aircrafts`)

**Request Body:** (Opción A: con vehicleId existente, Opción B: crear vehículo nuevo)

```typescript
{
  // Opción A: Usar vehículo existente
  vehicleId?: number;         // Optional, positive integer

  // Opción B: Crear nuevo vehículo (requeridos si no se proporciona vehicleId)
  licensePlate?: string;      // 2-20 chars, uppercase, alphanumeric + hyphen
  brand?: string;             // 2-50 chars
  model?: string;             // 1-50 chars
  year?: number;              // 1900-2100
  color?: string;             // 2-30 chars
  numberOfSeats?: number;     // 1-100 (integer)
  vehicleType?: string;       // 2-50 chars
  status?: 'available' | 'in_use' | 'maintenance' | 'retired';

  // Datos específicos de Aircraft (siempre requeridos)
  airlineId: number;          // Required, positive integer
  registrationCountry: string; // Required, 2-100 chars
  maxAltitude?: number;       // Optional, 0-60000
}
```

#### Actualizar Aircraft (PUT `/aircrafts/:id`)

**Request Body:** (todos los campos opcionales)

```typescript
{
  // Datos del vehículo
  licensePlate?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  numberOfSeats?: number;
  vehicleType?: string;
  status?: 'available' | 'in_use' | 'maintenance' | 'retired';

  // Datos específicos de Aircraft
  airlineId?: number;
  registrationCountry?: string;
  maxAltitude?: number;       // 0-60000
}
```

---

### 5.4 Cars (Automóviles)

#### Endpoints

| Método | Ruta        | Descripción                   |
| ------ | ----------- | ----------------------------- |
| GET    | `/cars`     | Obtener todos los automóviles |
| GET    | `/cars/:id` | Obtener un automóvil por ID   |
| POST   | `/cars`     | Crear un nuevo automóvil      |
| PUT    | `/cars/:id` | Actualizar un automóvil       |
| DELETE | `/cars/:id` | Eliminar un automóvil         |

#### Modelo de Datos

```typescript
interface Car {
  id: number
  vehicleId: number
  hotelId: number
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg'
  transmissionType: 'manual' | 'automatic' | 'cvt'
  // Inherited from Vehicle
  licensePlate: string
  brand: string
  model: string
  year: number
  color: string
  numberOfSeats: number
  vehicleType: string
  status: 'available' | 'in_use' | 'maintenance' | 'retired'
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Car (POST `/cars`)

**Request Body:** (Opción A: con vehicleId existente, Opción B: crear vehículo nuevo)

```typescript
{
  // Opción A: Usar vehículo existente
  vehicleId?: number;         // Optional, positive integer

  // Opción B: Crear nuevo vehículo (requeridos si no se proporciona vehicleId)
  licensePlate?: string;      // 2-20 chars, uppercase, alphanumeric + hyphen
  brand?: string;             // 2-50 chars
  model?: string;             // 1-50 chars
  year?: number;              // 1900-2100
  color?: string;             // 2-30 chars
  numberOfSeats?: number;     // 1-100 (integer)
  vehicleType?: string;       // 2-50 chars
  status?: 'available' | 'in_use' | 'maintenance' | 'retired';

  // Datos específicos de Car (siempre requeridos)
  hotelId: number;            // Required, positive integer
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg'; // Required
  transmissionType: 'manual' | 'automatic' | 'cvt'; // Required
}
```

#### Actualizar Car (PUT `/cars/:id`)

**Request Body:** (todos los campos opcionales)

```typescript
{
  // Datos del vehículo
  licensePlate?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  numberOfSeats?: number;
  vehicleType?: string;
  status?: 'available' | 'in_use' | 'maintenance' | 'retired';

  // Datos específicos de Car
  hotelId?: number;
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg';
  transmissionType?: 'manual' | 'automatic' | 'cvt';
}
```

---

### 5.5 GPS

#### Endpoints

| Método | Ruta       | Descripción           |
| ------ | ---------- | --------------------- |
| GET    | `/gps`     | Obtener todos los GPS |
| GET    | `/gps/:id` | Obtener un GPS por ID |
| POST   | `/gps`     | Crear un nuevo GPS    |
| PUT    | `/gps/:id` | Actualizar un GPS     |
| DELETE | `/gps/:id` | Eliminar un GPS       |

#### Modelo de Datos

```typescript
interface Gps {
  id: number
  vehicleId: number
  serialNumber: string
  brand: string
  model: string
  isActive: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear GPS (POST `/gps`)

**Request Body:**

```typescript
{
  vehicleId: number;          // Required, min 1
  serialNumber: string;       // Required, 5-50 chars, unique
  brand: string;              // Required, 2-100 chars
  model: string;              // Required, 1-100 chars
  isActive?: boolean;         // Optional, default: true
}
```

**Validaciones especiales:**

- `serialNumber`: Debe ser único en la base de datos

#### Actualizar GPS (PUT `/gps/:id`)

**Request Body:**

```typescript
{
  vehicleId?: number;         // min 1
  serialNumber?: string;      // 5-50 chars
  brand?: string;             // 2-100 chars
  model?: string;             // 1-100 chars
  isActive?: boolean;
}
```

---

### 5.6 Journeys (Trayectos)

#### Endpoints

| Método | Ruta            | Descripción                 |
| ------ | --------------- | --------------------------- |
| GET    | `/journeys`     | Obtener todos los trayectos |
| GET    | `/journeys/:id` | Obtener un trayecto por ID  |
| POST   | `/journeys`     | Crear un nuevo trayecto     |
| PUT    | `/journeys/:id` | Actualizar un trayecto      |
| DELETE | `/journeys/:id` | Eliminar un trayecto        |

#### Modelo de Datos

```typescript
interface Journey {
  id: number
  originMunicipalityId: number
  destinationMunicipalityId: number
  distance: number | null
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Journey (POST `/journeys`)

**Request Body:**

```typescript
{
  originMunicipalityId: number;      // Required, positive integer
  destinationMunicipalityId: number; // Required, positive integer
  distance?: number;                  // Optional, 0-50000 km
}
```

#### Actualizar Journey (PUT `/journeys/:id`)

**Request Body:**

```typescript
{
  originMunicipalityId?: number;
  destinationMunicipalityId?: number;
  distance?: number;                  // 0-50000 km
}
```

---

### 5.7 Transportation Services (Servicios de Transporte)

#### Endpoints

| Método | Ruta                           | Descripción                 |
| ------ | ------------------------------ | --------------------------- |
| GET    | `/transportation-services`     | Obtener todos los servicios |
| GET    | `/transportation-services/:id` | Obtener un servicio por ID  |
| POST   | `/transportation-services`     | Crear un nuevo servicio     |
| PUT    | `/transportation-services/:id` | Actualizar un servicio      |
| DELETE | `/transportation-services/:id` | Eliminar un servicio        |

> **Nota**: La especificación completa de este endpoint requiere revisar el validator `transportation_service.ts` que está vacío. Consulte con el equipo de backend.

---

### 5.8 Transport Itineraries (Itinerarios de Transporte)

#### Endpoints

| Método | Ruta                         | Descripción                   |
| ------ | ---------------------------- | ----------------------------- |
| GET    | `/transport-itineraries`     | Obtener todos los itinerarios |
| GET    | `/transport-itineraries/:id` | Obtener un itinerario por ID  |
| POST   | `/transport-itineraries`     | Crear un nuevo itinerario     |
| PUT    | `/transport-itineraries/:id` | Actualizar un itinerario      |
| DELETE | `/transport-itineraries/:id` | Eliminar un itinerario        |

#### Modelo de Datos

```typescript
interface TransportItinerary {
  id: number
  journeyId: number
  tripId: number
  transportationServiceId: number
  order: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Crear Transport Itinerary (POST `/transport-itineraries`)

**Request Body:**

```typescript
{
  journeyId: number // Required, positive integer
  tripId: number // Required, positive integer
  transportationServiceId: number // Required, positive integer
  order: number // Required, min 1 (integer)
}
```

#### Actualizar Transport Itinerary (PUT `/transport-itineraries/:id`)

**Request Body:**

```typescript
{
  journeyId?: number;
  tripId?: number;
  transportationServiceId?: number;
  order?: number;                  // min 1 (integer)
}
```

---

## 6. TIPOS COMUNES

### DateTime

Las fechas se manejan con el formato ISO 8601:

```typescript
// Ejemplo de fecha
'2025-11-17T10:30:00.000Z'
```

En las respuestas, las fechas aparecen como objetos DateTime de Luxon con la siguiente estructura:

```typescript
{
  createdAt: {
    // DateTime object
  }
}
```

### Paginación (cuando aplica)

Cuando se usa paginación, la respuesta incluye metadata:

```typescript
{
  message: string;
  data: {
    meta: {
      total: number;
      perPage: number;
      currentPage: number;
      lastPage: number;
      firstPage: number;
      firstPageUrl: string;
      lastPageUrl: string;
      nextPageUrl: string | null;
      previousPageUrl: string | null;
    };
    data: T[];
  };
}
```

---

## 7. MANEJO DE ERRORES

### Errores de Validación (400)

```typescript
{
  message: "Validation error",
  errors: [
    {
      field: string;
      message: string;
      rule: string;
    }
  ]
}
```

### Errores de Base de Datos

- **Código 23503** (Foreign Key Violation): Referencia a un registro que no existe
- **Código 23505** (Unique Violation): Violación de restricción de unicidad

### Errores Comunes por Endpoint

Cada endpoint puede retornar:

- `400` - Error de validación en el request body
- `404` - Recurso no encontrado (al buscar por ID o al referenciar FK inválida)
- `409` - Conflicto (violación de unicidad)
- `500` - Error interno del servidor

---

## 8. INTERFACES TYPESCRIPT PARA ANGULAR

### Archivo de Configuración de Ambiente

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3333/api',
}
```

### Interfaces Base

```typescript
// src/app/core/interfaces/api-response.interface.ts
export interface ApiResponse<T> {
  message: string
  data: T
}

export interface ApiErrorResponse {
  message: string
  error?: string
  errors?: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  rule: string
}

export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: string | null
  previousPageUrl: string | null
}

export interface PaginatedResponse<T> {
  meta: PaginationMeta
  data: T[]
}
```

### Ejemplo de Servicio Angular (Rooms)

```typescript
// src/app/services/room.service.ts
import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { ApiResponse, PaginatedResponse } from '../core/interfaces/api-response.interface'

export interface Room {
  id: number
  hotelId: number
  roomNumber: string
  roomType: string
  capacity: number
  pricePerNight: number
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning'
  createdAt: string
  updatedAt: string
}

export interface CreateRoomDto {
  hotelId: number
  roomNumber: string
  roomType: string
  capacity: number
  pricePerNight: number
  status?: 'available' | 'occupied' | 'maintenance' | 'cleaning'
}

export interface UpdateRoomDto {
  hotelId?: number
  roomNumber?: string
  roomType?: string
  capacity?: number
  pricePerNight?: number
  status?: 'available' | 'occupied' | 'maintenance' | 'cleaning'
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly baseUrl = `${environment.apiUrl}/rooms`

  constructor(private http: HttpClient) {}

  getRooms(
    page?: number,
    limit?: number
  ): Observable<ApiResponse<Room[] | PaginatedResponse<Room>>> {
    let params = new HttpParams()
    if (page) params = params.set('page', page.toString())
    if (limit) params = params.set('limit', limit.toString())

    return this.http.get<ApiResponse<Room[] | PaginatedResponse<Room>>>(this.baseUrl, { params })
  }

  getRoomById(id: number): Observable<ApiResponse<Room>> {
    return this.http.get<ApiResponse<Room>>(`${this.baseUrl}/${id}`)
  }

  createRoom(room: CreateRoomDto): Observable<ApiResponse<Room>> {
    return this.http.post<ApiResponse<Room>>(this.baseUrl, room)
  }

  updateRoom(id: number, room: UpdateRoomDto): Observable<ApiResponse<Room>> {
    return this.http.put<ApiResponse<Room>>(`${this.baseUrl}/${id}`, room)
  }

  deleteRoom(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
  }
}
```

---

## 9. NOTAS ADICIONALES

### Seguridad

- El middleware de seguridad está comentado en todas las rutas (comentado: `.use(middleware.Security)`)
- En producción, este middleware debe estar activo

### Convenciones de Nombres

- **Rutas**: kebab-case (`/hotel-admins`, `/bank-cards`)
- **Campos JSON**: camelCase (`hotelId`, `roomNumber`)
- **Campos DB**: snake_case (manejado automáticamente por el ORM)

### Relaciones

Los modelos incluyen relaciones que pueden ser cargadas con eager loading. Consulte la documentación del backend para más detalles sobre cómo cargar relaciones.

---

**Generado el**: 17 de noviembre de 2025  
**Versión del API**: 1.0  
**Framework Backend**: AdonisJS 6  
**Base de Datos**: PostgreSQL
