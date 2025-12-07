# 📬 Sistema de Notificaciones - Documentación Completa

## 📑 Índice de Documentos

| Documento                                                                            | Descripción                                 |
| ------------------------------------------------------------------------------------ | ------------------------------------------- |
| **[QUICKSTART_NOTIFICATIONS.md](./QUICKSTART_NOTIFICATIONS.md)**                     | ⚡ Inicio rápido - Lo esencial en 5 minutos |
| **[NOTIFICATION_SYSTEM.md](./NOTIFICATION_SYSTEM.md)**                               | 📖 Documentación completa del sistema       |
| **[NOTIFICATION_DIAGRAM.md](./NOTIFICATION_DIAGRAM.md)**                             | 📊 Diagramas visuales de arquitectura       |
| **[PYTHON_MS_REFERENCE.md](./PYTHON_MS_REFERENCE.md)**                               | 🐍 Referencia para implementar el MS Python |
| **[app/examples/notification_examples.ts](./app/examples/notification_examples.ts)** | 💡 8 ejemplos prácticos de código           |

---

## 🎯 ¿Qué se ha implementado?

### ✅ Sistema Completo de Notificaciones Event-Driven

- **Arquitectura basada en eventos** para comunicar MS de Negocio → MS de Notificaciones
- **Hooks automáticos** en modelos (Trip, Vehicle) que detectan cambios y emiten eventos
- **Emisión manual** desde controladores con control total
- **9 tipos de eventos** categorizados (anomalías, cancelaciones, confirmaciones, resumen)
- **Tolerancia a fallos** - las notificaciones no bloquean operaciones críticas

### 📦 Archivos Creados

```
app/
├── services/
│   ├── notification_service.ts          # ⭐ Servicio principal
│   ├── types/
│   │   └── notification_types.ts        # Tipos TypeScript
│   └── helpers/
│       └── notification_helpers.ts      # Helpers útiles
├── examples/
│   └── notification_examples.ts         # 8 ejemplos completos
└── models/
    ├── core/
    │   └── trip.ts                      # ✨ Hooks @beforeUpdate
    └── transportation/
        └── vehicle.ts                   # ✨ Hooks @beforeUpdate

📚 Documentación:
├── NOTIFICATION_SYSTEM.md               # Documentación completa
├── QUICKSTART_NOTIFICATIONS.md          # Guía rápida
├── NOTIFICATION_DIAGRAM.md              # Diagramas
├── PYTHON_MS_REFERENCE.md               # Referencia Python
└── .env.notifications.example           # Variables de entorno
```

---

## 🚀 Inicio Rápido

### 1️⃣ Configurar

```bash
# Añadir a .env
NOTIFICATION_SERVICE_URL=http://localhost:5000
NOTIFICATIONS_ENABLED=true
```

### 2️⃣ Usar (Automático)

```typescript
// Los hooks se encargan automáticamente
const trip = await Trip.findOrFail(tripId)
trip.status = 'cancelled'
await trip.save()
// ✅ Notificaciones enviadas automáticamente
```

### 3️⃣ Usar (Manual)

```typescript
import notificationService from '#services/notification_service'

await notificationService.notifyActivityCancelled({
  activityId: 1,
  activityName: 'Tour del Café',
  reason: 'Clima adverso',
  tripId: 5,
  tripName: 'Eje Cafetero',
  affectedClients: [{ name: 'Juan', email: 'juan@email.com' }],
})
```

---

## 📨 Tipos de Eventos

### 🚨 Anomalías

- `itinerary.segment.delayed` - Retraso en itinerario
- `vehicle.breakdown` - Avería de vehículo
- `vehicle.status.changed` - Cambio de estado de vehículo

### ❌ Cancelaciones

- `activity.cancelled` - Actividad cancelada
- `trip.cancelled` - Viaje cancelado

### ✅ Confirmaciones

- `payment.accepted` - Pago confirmado
- `booking.confirmed` - Reserva confirmada
- `trip.status.changed` - Estado de viaje cambió

### 📊 Resumen

- `service.completed` - Servicio completado (resumen final)

---

## 🏗️ Arquitectura

```
MS Negocio (AdonisJS)  →  NotificationService  →  HTTP POST  →  MS Notificaciones (Python)
                                                                         ↓
                                                                 Email + Telegram
```

### Características Clave

- ✅ **Desacoplado** - MS de Negocio no depende del MS de Notificaciones
- ✅ **Asíncrono** - No bloquea operaciones críticas
- ✅ **Configurable** - Se puede habilitar/deshabilitar
- ✅ **Solo servicios activos** - No notifica si no hay clientes afectados
- ✅ **Logging completo** - Todos los eventos se registran

---

## 🎯 Casos de Uso

### ✅ Caso 1: Vehículo se avería durante servicio activo

```typescript
// En el controlador
const vehicle = await Vehicle.findOrFail(vehicleId)
vehicle.status = 'averiado'
await vehicle.save()

// El hook detecta:
// 1. Cambio de estado → averiado
// 2. Busca servicios de transporte activos
// 3. Identifica viajes en curso
// 4. Obtiene clientes afectados
// 5. Emite evento → MS Notificaciones
// 6. Clientes reciben email + Telegram ✅
```

### ✅ Caso 2: Viaje se cancela

```typescript
const trip = await Trip.findOrFail(tripId)
trip.status = 'cancelled'
await trip.save()

// El hook automáticamente:
// 1. Detecta cambio a 'cancelled'
// 2. Obtiene lista de clientes
// 3. Emite evento 'trip.cancelled'
// 4. MS Notificaciones envía emails/Telegram ✅
```

### ✅ Caso 3: Actividad se cancela (manual)

```typescript
// En el controlador
const activity = await TouristActivity.findOrFail(activityId)

// Obtener viajes activos con esta actividad
const affectedClients = await getAffectedClientsFromTrip(tripId)

// Emitir evento manualmente
await notificationService.notifyActivityCancelled({
  activityId: activity.id,
  activityName: activity.name,
  reason: 'Condiciones climáticas adversas',
  tripId: trip.id,
  tripName: trip.name,
  affectedClients,
})
// ✅ Notificaciones enviadas
```

### ✅ Caso 4: Pago confirmado

```typescript
const invoice = await Invoice.query()
  .where('id', invoiceId)
  .preload('fee', (q) => q.preload('trip').preload('client'))
  .firstOrFail()

invoice.paymentDate = DateTime.now()
await invoice.save()

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
// ✅ Cliente recibe confirmación de pago
```

### ✅ Caso 5: Viaje finaliza - Envío de resumen

```typescript
const trip = await Trip.findOrFail(tripId)
trip.status = 'completed'
await trip.save()

// El hook automáticamente:
// 1. Detecta cambio de 'active' → 'completed'
// 2. Genera resumen del viaje
// 3. Emite evento 'service.completed'
// 4. Cliente principal recibe resumen completo ✅
```

---

## 🧪 Testing

```bash
# Deshabilitar notificaciones en tests
NOTIFICATIONS_ENABLED=false
```

```typescript
// En tests
test('should cancel trip without sending notifications', async () => {
  const trip = await Trip.findOrFail(1)
  trip.status = 'cancelled'
  await trip.save()
  // No se envían notificaciones en modo test
})
```

---

## 📚 API del NotificationService

```typescript
// Anomalías
notificationService.notifyItinerarySegmentDelayed(data)
notificationService.notifyVehicleBreakdown(data)
notificationService.notifyVehicleStatusChanged(data)

// Cancelaciones
notificationService.notifyActivityCancelled(data)
notificationService.notifyTripCancelled(data)

// Confirmaciones
notificationService.notifyPaymentAccepted(data)
notificationService.notifyBookingConfirmed(data)
notificationService.notifyTripStatusChanged(data)

// Resumen
notificationService.notifyServiceCompleted(data)
```

---

## 🔧 Helpers Disponibles

```typescript
import {
  getAffectedClientsFromTrip, // Obtiene clientes de un viaje
  getTripInfo, // Info básica del viaje
  isTripInService, // ¿Viaje activo?
  isVehicleInService, // ¿Vehículo en servicio?
  formatClient, // Formatea datos de cliente
} from '#services/helpers/notification_helpers'
```

---

## 🐍 Integración con MS Notificaciones (Python)

El MS de Notificaciones debe:

1. **Escuchar en** `http://localhost:5000`
2. **Exponer endpoint** `POST /event`
3. **Recibir JSON** con formato:

```json
{
  "event_type": "vehicle.breakdown",
  "payload": {
    "vehicleId": 42,
    "licensePlate": "ABC-123",
    "reason": "Avería en motor",
    "tripId": 88,
    "tripName": "Tour Eje Cafetero",
    "affectedClients": [
      {
        "name": "Carlos Pérez",
        "email": "carlos@email.com",
        "phone": "3001234567"
      }
    ]
  },
  "timestamp": "2025-12-07T12:00:00.000Z"
}
```

4. **Enviar notificaciones** por Email y/o Telegram
5. **Retornar respuesta**:

```json
{
  "status": "ok",
  "message": "Event received and notifications sent"
}
```

Ver **[PYTHON_MS_REFERENCE.md](./PYTHON_MS_REFERENCE.md)** para implementación completa en Python.

---

## ✅ Checklist de Implementación

- [x] ✅ Servicio de notificaciones
- [x] ✅ Tipos de eventos definidos
- [x] ✅ Hooks en modelos Trip y Vehicle
- [x] ✅ Helpers para clientes afectados
- [x] ✅ 8 ejemplos completos
- [x] ✅ Documentación completa
- [x] ✅ Diagramas visuales
- [x] ✅ Referencia Python
- [ ] ⚠️ **Configurar variables de entorno**
- [ ] ⚠️ **Implementar MS Notificaciones (Python)**
- [ ] ⚠️ **Configurar SMTP para emails**
- [ ] ⚠️ **Configurar Telegram Bot**

---

## 🎉 ¡Sistema Listo!

El sistema está **100% funcional** en el lado del MS de Negocio. Solo falta:

1. ✅ Añadir variables de entorno al `.env`
2. ✅ Implementar el MS de Notificaciones en Python (ver referencia)
3. ✅ Configurar servicios de email y Telegram

**¡Todo está documentado y listo para usar!** 🚀

---

## 📞 Documentación por Sección

| Si necesitas...        | Lee esto...                                                                      |
| ---------------------- | -------------------------------------------------------------------------------- |
| Empezar rápido         | [QUICKSTART_NOTIFICATIONS.md](./QUICKSTART_NOTIFICATIONS.md)                     |
| Documentación completa | [NOTIFICATION_SYSTEM.md](./NOTIFICATION_SYSTEM.md)                               |
| Ver diagramas          | [NOTIFICATION_DIAGRAM.md](./NOTIFICATION_DIAGRAM.md)                             |
| Implementar Python     | [PYTHON_MS_REFERENCE.md](./PYTHON_MS_REFERENCE.md)                               |
| Ver ejemplos de código | [app/examples/notification_examples.ts](./app/examples/notification_examples.ts) |

---

**¡Feliz desarrollo!** 🎊
