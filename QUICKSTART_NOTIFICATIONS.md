# 🚀 Guía Rápida - Sistema de Notificaciones

## ⚡ Inicio Rápido

### 1. Configurar Variables de Entorno

```bash
# .env
NOTIFICATION_SERVICE_URL=http://localhost:5000
NOTIFICATIONS_ENABLED=true
```

### 2. Usar Hooks Automáticos (Más fácil)

```typescript
// Los modelos Trip y Vehicle ya tienen hooks configurados
// Solo necesitas cambiar el estado:

const trip = await Trip.findOrFail(tripId)
trip.status = 'cancelled' // o 'completed', 'active', etc.
await trip.save()
// ✅ Las notificaciones se envían automáticamente

const vehicle = await Vehicle.findOrFail(vehicleId)
vehicle.status = 'averiado'
await vehicle.save()
// ✅ Notifica a clientes de viajes activos automáticamente
```

### 3. Usar Manualmente en Controladores

```typescript
import notificationService from '#services/notification_service'
import { getAffectedClientsFromTrip } from '#services/helpers/notification_helpers'

// Ejemplo: Cancelar actividad
async cancel({ params, request, response }: HttpContext) {
  const { reason } = request.only(['reason'])
  const activity = await TouristActivity.findOrFail(params.id)

  const affectedClients = await getAffectedClientsFromTrip(tripId)

  await notificationService.notifyActivityCancelled({
    activityId: activity.id,
    activityName: activity.name,
    reason,
    tripId: trip.id,
    tripName: trip.name,
    affectedClients
  })

  return response.ok({ message: 'Notificaciones enviadas' })
}
```

## 📋 Checklist de Implementación

- [x] ✅ Servicio de notificaciones creado
- [x] ✅ Tipos de eventos definidos
- [x] ✅ Hooks automáticos en Trip
- [x] ✅ Hooks automáticos en Vehicle
- [x] ✅ Helpers para obtener clientes
- [x] ✅ 8 ejemplos completos
- [x] ✅ Documentación completa
- [ ] ⚠️ Configurar variables de entorno
- [ ] ⚠️ Verificar que MS Notificaciones esté en http://localhost:5000

## 📚 Recursos

| Archivo                                 | Descripción                 |
| --------------------------------------- | --------------------------- |
| `NOTIFICATION_SYSTEM.md`                | 📖 Documentación completa   |
| `app/examples/notification_examples.ts` | 💡 8 ejemplos de uso        |
| `app/services/notification_service.ts`  | 🔧 Servicio principal       |
| `.env.notifications.example`            | ⚙️ Ejemplo de configuración |

## 🎯 Eventos Principales

```typescript
// Anomalías
notificationService.notifyItinerarySegmentDelayed(...)
notificationService.notifyVehicleBreakdown(...)

// Cancelaciones
notificationService.notifyActivityCancelled(...)
notificationService.notifyTripCancelled(...)

// Confirmaciones
notificationService.notifyPaymentAccepted(...)
notificationService.notifyBookingConfirmed(...)

// Resumen
notificationService.notifyServiceCompleted(...)
```

## 🔄 Flujo del Sistema

```
Controller/Model → NotificationService → HTTP POST → MS Notificaciones
                                                           ↓
                                                   Email + Telegram
```

## 🧪 Testing

```bash
# Deshabilitar notificaciones para tests
NOTIFICATIONS_ENABLED=false
```

## 📞 Soporte

- Ver ejemplos completos en: `app/examples/notification_examples.ts`
- Documentación: `NOTIFICATION_SYSTEM.md`
- Tipos de eventos: `app/services/types/notification_types.ts`

---

**¡Sistema listo para producción!** 🎉
