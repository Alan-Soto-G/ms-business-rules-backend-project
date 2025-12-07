# 📬 Sistema de Notificaciones - Microservicio de Negocio

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Configuración](#configuración)
4. [Tipos de Eventos](#tipos-de-eventos)
5. [Uso en el Código](#uso-en-el-código)
6. [Ejemplos Prácticos](#ejemplos-prácticos)
7. [Integración con MS Notificaciones](#integración-con-ms-notificaciones)

---

## 📖 Descripción General

Este sistema implementa una **arquitectura basada en eventos (Event-Driven)** para comunicar el microservicio de Negocio (AdonisJS) con el microservicio de Notificaciones (Python).

### ✨ Características Principales

- ✅ **Notificaciones automáticas** mediante hooks de modelos
- ✅ **Emisión manual** de eventos desde controladores
- ✅ **Comunicación HTTP** con el MS de Notificaciones
- ✅ **Tolerancia a fallos** - las notificaciones no bloquean operaciones críticas
- ✅ **Configuración flexible** - se puede habilitar/deshabilitar

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│   MS NEGOCIO (AdonisJS)                 │
│                                         │
│   ┌──────────────┐                     │
│   │   Modelos    │                     │
│   │   (Hooks)    │──────┐              │
│   └──────────────┘      │              │
│                         ▼              │
│   ┌──────────────┐  ┌─────────────────┐│
│   │ Controladores│─▶│ Notification    ││
│   │              │  │ Service         ││
│   └──────────────┘  └─────────────────┘│
│                         │ HTTP POST     │
└─────────────────────────┼───────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ MS NOTIFICACIONES     │
              │ (Python)              │
              │ http://localhost:5000 │
              │                       │
              │ POST /event           │
              │  ├─ Email             │
              │  └─ Telegram          │
              └───────────────────────┘
```

### 🔄 Flujo de Eventos

1. **Algo sucede en el MS Negocio**
   - Cambio de estado de viaje
   - Avería de vehículo
   - Cancelación de actividad
   - Confirmación de pago
   - etc.

2. **Se emite un evento**
   - Automáticamente (via hooks de modelos)
   - Manualmente (desde controladores)

3. **El NotificationService envía el evento**
   - HTTP POST a `http://localhost:5000/event`
   - Formato JSON con `event_type` y `payload`

4. **El MS Notificaciones lo procesa**
   - Selecciona la plantilla correcta
   - Envía emails/Telegram según el tipo de evento
   - Registra la notificación

---

## ⚙️ Configuración

### 1️⃣ Variables de Entorno

Añade estas variables a tu archivo `.env`:

```bash
# URL del microservicio de notificaciones
NOTIFICATION_SERVICE_URL=http://localhost:5000

# Habilitar/deshabilitar notificaciones
NOTIFICATIONS_ENABLED=true
```

### 2️⃣ Archivo de Configuración

Las variables ya están configuradas en `start/env.ts`:

```typescript
NOTIFICATION_SERVICE_URL: Env.schema.string.optional(),
NOTIFICATIONS_ENABLED: Env.schema.string.optional(),
```

---

## 📨 Tipos de Eventos

### 🚨 Anomalías

| Tipo de Evento              | Descripción                     | Cuándo se emite                                           |
| --------------------------- | ------------------------------- | --------------------------------------------------------- |
| `itinerary.segment.delayed` | Retraso en tramo del itinerario | Vuelo retrasado, transporte demorado                      |
| `vehicle.breakdown`         | Avería de vehículo              | Vehículo pasa a estado "averiado" durante servicio activo |
| `vehicle.status.changed`    | Cambio de estado de vehículo    | Cualquier cambio de estado                                |

### ❌ Cancelaciones

| Tipo de Evento       | Descripción                   | Cuándo se emite                                 |
| -------------------- | ----------------------------- | ----------------------------------------------- |
| `activity.cancelled` | Actividad turística cancelada | Se cancela una actividad con clientes afectados |
| `trip.cancelled`     | Viaje cancelado               | Viaje cambia a estado "cancelled"               |

### ✅ Confirmaciones

| Tipo de Evento        | Descripción               | Cuándo se emite                  |
| --------------------- | ------------------------- | -------------------------------- |
| `payment.accepted`    | Pago aceptado             | Se registra un pago de factura   |
| `booking.confirmed`   | Reserva confirmada        | Se confirma una reserva de hotel |
| `trip.status.changed` | Cambio de estado de viaje | Viaje cambia de estado           |

### 📊 Resumen de Servicios

| Tipo de Evento      | Descripción         | Cuándo se emite                        |
| ------------------- | ------------------- | -------------------------------------- |
| `service.completed` | Servicio completado | Viaje cambia de "active" a "completed" |

---

## 💻 Uso en el Código

### 🔧 Importar el servicio

```typescript
import notificationService from '#services/notification_service'
import { getAffectedClientsFromTrip } from '#services/helpers/notification_helpers'
```

### 📝 Uso Manual en Controladores

#### Ejemplo 1: Cancelar Actividad

```typescript
export default class TouristActivityController {
  async cancel({ params, request, response }: HttpContext) {
    const activityId = params.id
    const { reason } = request.only(['reason'])

    const activity = await TouristActivity.findOrFail(activityId)

    // Obtener clientes afectados (viajes activos con esta actividad)
    // ... lógica para obtener viajes y clientes ...

    // Emitir evento
    await notificationService.notifyActivityCancelled({
      activityId: activity.id,
      activityName: activity.name,
      reason,
      tripId: trip.id,
      tripName: trip.name,
      affectedClients: [
        { name: 'Juan Pérez', email: 'juan@email.com', phone: '3001234567' },
        { name: 'María García', email: 'maria@email.com' },
      ],
    })

    return response.ok({ message: 'Actividad cancelada y notificaciones enviadas' })
  }
}
```

#### Ejemplo 2: Confirmar Pago

```typescript
export default class InvoiceController {
  async confirmPayment({ params, response }: HttpContext) {
    const invoice = await Invoice.query()
      .where('id', params.id)
      .preload('fee', (query) => {
        query.preload('trip').preload('client')
      })
      .firstOrFail()

    // Actualizar fecha de pago
    invoice.paymentDate = DateTime.now()
    await invoice.save()

    // Emitir evento
    await notificationService.notifyPaymentAccepted({
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.totalAmount,
      paymentMethod: invoice.paymentMethod,
      clientName: invoice.fee.client.name,
      clientEmail: invoice.fee.client.email,
      tripId: invoice.fee.trip.id,
      tripName: invoice.fee.trip.name,
    })

    return response.ok({ message: 'Pago confirmado' })
  }
}
```

### 🪝 Hooks Automáticos en Modelos

Los modelos **Trip** y **Vehicle** ya tienen hooks configurados que emiten eventos automáticamente:

#### Hook en Trip (app/models/core/trip.ts)

```typescript
@beforeUpdate()
static async notifyStatusChange(trip: Trip) {
  if (trip.$dirty.status) {
    const oldStatus = trip.$original.status
    const newStatus = trip.status

    // Cancelación
    if (newStatus === 'cancelled') {
      await notificationService.notifyTripCancelled({...})
    }

    // Finalización
    if (newStatus === 'completed' && oldStatus === 'active') {
      await notificationService.notifyServiceCompleted({...})
    }

    // Cambio de estado
    await notificationService.notifyTripStatusChanged({...})
  }
}
```

**Uso:**

```typescript
// Solo cambias el estado, el hook se encarga del resto
const trip = await Trip.findOrFail(tripId)
trip.status = 'cancelled'
await trip.save()
// ✅ Automáticamente se envían las notificaciones
```

#### Hook en Vehicle (app/models/transportation/vehicle.ts)

```typescript
@beforeUpdate()
static async notifyVehicleStatusChange(vehicle: Vehicle) {
  if (vehicle.$dirty.status) {
    // Detecta si el vehículo tiene servicios activos
    // Emite notificaciones a clientes afectados
  }
}
```

**Uso:**

```typescript
// Solo cambias el estado
const vehicle = await Vehicle.findOrFail(vehicleId)
vehicle.status = 'averiado'
await vehicle.save()
// ✅ Automáticamente notifica a los clientes de viajes activos
```

---

## 🎯 Ejemplos Prácticos

Consulta el archivo `app/examples/notification_examples.ts` para ver **8 ejemplos completos**:

1. ✅ Cancelar actividad turística
2. ✅ Reportar avería de vehículo
3. ✅ Confirmar pago de cuota
4. ✅ Confirmar reserva de hotel
5. ✅ Reportar retraso en itinerario
6. ✅ Completar viaje
7. ✅ Cancelar viaje
8. ✅ Uso en controladores

### Ejemplo Completo: Reportar Retraso de Vuelo

```typescript
import { HttpContext } from '@adonisjs/core/http'
import TransportItinerary from '#models/transportation/transport_itinerary'
import notificationService from '#services/notification_service'
import { getAffectedClientsFromTrip } from '#services/helpers/notification_helpers'

export default class TransportController {
  /**
   * POST /api/transport-itinerary/:id/delay
   * Body: { delayMinutes: 60, reason: "Condiciones climáticas" }
   */
  async reportDelay({ params, request, response }: HttpContext) {
    const { delayMinutes, reason } = request.only(['delayMinutes', 'reason'])

    // 1. Obtener el itinerario con relaciones
    const itinerary = await TransportItinerary.query()
      .where('id', params.id)
      .preload('trip')
      .preload('transportationService', (query) => {
        query.preload('journey')
      })
      .firstOrFail()

    // 2. Verificar que el viaje esté activo
    if (!['active', 'published'].includes(itinerary.trip.status)) {
      return response.badRequest({
        message: 'Solo se pueden reportar retrasos en viajes activos',
      })
    }

    // 3. Obtener clientes afectados
    const affectedClients = await getAffectedClientsFromTrip(itinerary.tripId)

    // 4. Emitir evento de notificación
    await notificationService.notifyItinerarySegmentDelayed({
      tripId: itinerary.trip.id,
      tripName: itinerary.trip.name,
      segmentId: itinerary.id,
      segmentType: itinerary.transportationService.journey.vehicleType || 'transporte',
      delayMinutes,
      reason,
      affectedClients,
    })

    // 5. Registrar el retraso (opcional, según tu lógica)
    // await ItineraryDelay.create({ itineraryId: itinerary.id, delayMinutes, reason })

    return response.ok({
      message: `Retraso reportado: ${delayMinutes} minutos`,
      notificationsSent: affectedClients.length,
    })
  }
}
```

---

## 🔗 Integración con MS Notificaciones

### Formato del Evento Enviado

```json
{
  "event_type": "vehicle.breakdown",
  "payload": {
    "vehicleId": 42,
    "licensePlate": "ABC-123",
    "vehicleType": "Bus",
    "reason": "Avería en motor",
    "tripId": 88,
    "tripName": "Tour Eje Cafetero",
    "affectedClients": [
      {
        "name": "Carlos Pérez",
        "email": "carlos@email.com",
        "phone": "3001234567"
      },
      {
        "name": "Ana López",
        "email": "ana@email.com"
      }
    ]
  },
  "timestamp": "2025-12-07T12:00:00.000Z"
}
```

### Endpoint del MS Notificaciones

```
POST http://localhost:5000/event
Content-Type: application/json
```

### Respuesta Esperada

```json
{
  "status": "ok",
  "message": "Event received and notifications sent"
}
```

---

## 🧪 Testing

### Deshabilitar notificaciones en tests

```bash
# En .env.test
NOTIFICATIONS_ENABLED=false
```

### Verificar logs

Las notificaciones se registran en los logs con nivel `info`:

```
[INFO] [Notification Event Sent] vehicle.breakdown
```

Si hay errores:

```
[ERROR] [Notification Error] Failed to send event: vehicle.breakdown
```

---

## 🛠️ Helpers Disponibles

```typescript
import {
  getAffectedClientsFromTrip,
  getTripInfo,
  isTripInService,
  isVehicleInService,
  formatClient,
} from '#services/helpers/notification_helpers'
```

### `getAffectedClientsFromTrip(tripId: number)`

Obtiene la lista de clientes de un viaje.

### `getTripInfo(tripId: number)`

Obtiene información básica del viaje.

### `isTripInService(status: string)`

Verifica si un viaje está activo.

### `isVehicleInService(status: string)`

Verifica si un vehículo está en servicio.

---

## 📚 Archivos Creados

```
app/
├── services/
│   ├── notification_service.ts          # Servicio principal
│   ├── types/
│   │   └── notification_types.ts        # Definición de tipos
│   └── helpers/
│       └── notification_helpers.ts      # Funciones auxiliares
├── examples/
│   └── notification_examples.ts         # 8 ejemplos de uso
└── models/
    ├── core/
    │   └── trip.ts                      # ✨ Hook @beforeUpdate
    └── transportation/
        └── vehicle.ts                   # ✨ Hook @beforeUpdate
```

---

## 🎉 ¡Listo para usar!

El sistema está completamente funcional. Solo necesitas:

1. ✅ Configurar las variables de entorno
2. ✅ Asegurarte de que el MS Notificaciones esté corriendo en `http://localhost:5000`
3. ✅ Usar el servicio en tus controladores o dejar que los hooks hagan el trabajo

**¡Las notificaciones se enviarán automáticamente!** 🚀
