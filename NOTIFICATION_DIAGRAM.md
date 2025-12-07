# 📊 Diagrama del Sistema de Notificaciones

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MICROSERVICIO DE NEGOCIO                         │
│                         (AdonisJS)                                  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                        MODELOS                                │  │
│  │                                                               │  │
│  │  ┌─────────────┐              ┌──────────────┐              │  │
│  │  │    Trip     │              │   Vehicle    │              │  │
│  │  │             │              │              │              │  │
│  │  │ @beforeUpd. │              │ @beforeUpd.  │              │  │
│  │  │    Hook     │              │    Hook      │              │  │
│  │  └──────┬──────┘              └──────┬───────┘              │  │
│  │         │                            │                       │  │
│  └─────────┼────────────────────────────┼───────────────────────┘  │
│            │                            │                          │
│            └──────────┬─────────────────┘                          │
│                       ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    CONTROLADORES                             │  │
│  │                                                               │  │
│  │  TripController    VehicleController    ActivityController   │  │
│  │        │                  │                     │            │  │
│  │        └──────────────────┼─────────────────────┘            │  │
│  └───────────────────────────┼──────────────────────────────────┘  │
│                              ▼                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              NotificationService                             │  │
│  │                                                               │  │
│  │  • notifyTripCancelled()                                     │  │
│  │  • notifyVehicleBreakdown()                                  │  │
│  │  • notifyActivityCancelled()                                 │  │
│  │  • notifyPaymentAccepted()                                   │  │
│  │  • notifyServiceCompleted()                                  │  │
│  │  • etc...                                                    │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                              │                                     │
└──────────────────────────────┼─────────────────────────────────────┘
                               │
                               │ HTTP POST /event
                               │ {
                               │   "event_type": "...",
                               │   "payload": {...}
                               │ }
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│              MICROSERVICIO DE NOTIFICACIONES                         │
│                      (Python - Flask/FastAPI)                        │
│                      http://localhost:5000                           │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    POST /event                                 │ │
│  │                                                                 │ │
│  │  Recibe evento → Selecciona plantilla → Envía notificación    │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌──────────────────┐              ┌──────────────────┐            │
│  │  Email Service   │              │ Telegram Service │            │
│  │                  │              │                  │            │
│  │  📧 SMTP         │              │  🤖 Bot API      │            │
│  └─────────┬────────┘              └──────────┬───────┘            │
│            │                                   │                    │
└────────────┼───────────────────────────────────┼────────────────────┘
             │                                   │
             ▼                                   ▼
      📨 Email Client                    💬 Telegram Client
```

## 🔄 Flujo de Eventos Detallado

### 1️⃣ CAMBIO DE ESTADO EN MODELO (Automático)

```
Usuario actualiza Trip
         │
         ▼
trip.status = 'cancelled'
         │
         ▼
trip.save()
         │
         ▼
@beforeUpdate() Hook se ejecuta
         │
         ▼
Detecta cambio: status
         │
         ▼
NotificationService.notifyTripCancelled()
         │
         ▼
HTTP POST → MS Notificaciones
         │
         ▼
Email + Telegram enviados
```

### 2️⃣ LLAMADA MANUAL DESDE CONTROLADOR

```
Cliente cancela actividad
         │
         ▼
Controller.cancel()
         │
         ▼
getAffectedClientsFromTrip(tripId)
         │
         ▼
NotificationService.notifyActivityCancelled({
  activityId, activityName, reason,
  affectedClients: [...]
})
         │
         ▼
HTTP POST → MS Notificaciones
         │
         ▼
Email + Telegram enviados
```

## 📦 Estructura de un Evento

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
      }
    ]
  },
  "timestamp": "2025-12-07T12:00:00.000Z"
}
```

## 🎯 Tipos de Eventos por Categoría

```
┌─────────────────────────────────────────────────────────────────┐
│                        ANOMALÍAS 🚨                             │
├─────────────────────────────────────────────────────────────────┤
│ itinerary.segment.delayed    → Retraso en itinerario           │
│ vehicle.breakdown            → Avería de vehículo               │
│ vehicle.status.changed       → Cambio estado vehículo           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      CANCELACIONES ❌                           │
├─────────────────────────────────────────────────────────────────┤
│ activity.cancelled           → Actividad cancelada              │
│ trip.cancelled               → Viaje cancelado                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      CONFIRMACIONES ✅                          │
├─────────────────────────────────────────────────────────────────┤
│ payment.accepted             → Pago confirmado                  │
│ booking.confirmed            → Reserva confirmada               │
│ trip.status.changed          → Estado de viaje cambió           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         RESUMEN 📊                              │
├─────────────────────────────────────────────────────────────────┤
│ service.completed            → Servicio completado              │
└─────────────────────────────────────────────────────────────────┘
```

## 🧩 Componentes Principales

```
app/services/
│
├── notification_service.ts
│   ├── emit(eventType, payload)
│   ├── notifyTripCancelled()
│   ├── notifyVehicleBreakdown()
│   ├── notifyActivityCancelled()
│   ├── notifyPaymentAccepted()
│   ├── notifyBookingConfirmed()
│   ├── notifyItinerarySegmentDelayed()
│   └── notifyServiceCompleted()
│
├── types/
│   └── notification_types.ts
│       ├── EventType (enum)
│       ├── AffectedClient (interface)
│       └── *Payload (interfaces)
│
└── helpers/
    └── notification_helpers.ts
        ├── getAffectedClientsFromTrip()
        ├── getTripInfo()
        ├── isTripInService()
        └── isVehicleInService()
```

## 🎬 Ejemplo: Flujo Completo de Avería de Vehículo

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. MECÁNICO REPORTA AVERÍA                                     │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. CONTROLADOR ACTUALIZA VEHÍCULO                              │
│    vehicle.status = 'averiado'                                 │
│    await vehicle.save()                                        │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. HOOK @beforeUpdate SE EJECUTA                               │
│    • Detecta cambio de estado                                  │
│    • Busca servicios de transporte activos                     │
│    • Identifica viajes afectados                               │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. OBTIENE CLIENTES AFECTADOS                                  │
│    affectedClients = await getAffectedClientsFromTrip(tripId)  │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. EMITE EVENTO                                                │
│    notificationService.notifyVehicleBreakdown({                │
│      vehicleId, licensePlate, reason,                          │
│      tripId, tripName, affectedClients                         │
│    })                                                          │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. HTTP POST A MS NOTIFICACIONES                               │
│    POST http://localhost:5000/event                            │
│    Body: { event_type, payload, timestamp }                    │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. MS NOTIFICACIONES PROCESA                                   │
│    • Selecciona plantilla "vehicle_breakdown"                  │
│    • Genera contenido personalizado                            │
│    • Envía a cada cliente afectado                             │
└───────────────────────┬─────────────────────────────────────────┘
                        │
           ┌────────────┴────────────┐
           ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│ 📧 Email         │      │ 💬 Telegram      │
│                  │      │                  │
│ Carlos Pérez     │      │ Carlos Pérez     │
│ Ana López        │      │ Ana López        │
└──────────────────┘      └──────────────────┘
```

---

**Sistema completamente funcional y listo para usar** 🚀
