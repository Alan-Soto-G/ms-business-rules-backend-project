# ⚡ SISTEMA DE NOTIFICACIONES - RESUMEN EJECUTIVO

## 🎯 ¿Qué hace?

Envía notificaciones automáticas (Email + Telegram) cuando ocurren eventos importantes:

- 🚨 **Anomalías**: Avería de vehículo, retrasos en itinerario
- ❌ **Cancelaciones**: Viajes o actividades canceladas
- ✅ **Confirmaciones**: Pagos, reservas, cambios de estado
- 📊 **Resumen**: Informe final al completar un viaje

---

## 🚀 Cómo usar (3 pasos)

### 1. Configurar `.env`

```bash
NOTIFICATION_SERVICE_URL=http://localhost:5000
NOTIFICATIONS_ENABLED=true
```

### 2. Opción A: Automático (Recomendado)

```typescript
// Solo cambia el estado, el hook hace el resto
const trip = await Trip.findOrFail(tripId)
trip.status = 'cancelled'
await trip.save()
// ✅ Notificaciones enviadas automáticamente
```

### 3. Opción B: Manual (Control total)

```typescript
import notificationService from '#services/notification_service'

await notificationService.notifyActivityCancelled({
  activityId: 1,
  activityName: 'Tour del Café',
  reason: 'Clima adverso',
  affectedClients: [{ name: 'Juan', email: 'juan@email.com' }],
})
```

---

## 📦 Archivos Importantes

| Archivo                                 | Qué hace                                 |
| --------------------------------------- | ---------------------------------------- |
| `app/services/notification_service.ts`  | Servicio principal - todas las funciones |
| `app/models/core/trip.ts`               | Hook automático para viajes              |
| `app/models/transportation/vehicle.ts`  | Hook automático para vehículos           |
| `app/examples/notification_examples.ts` | 8 ejemplos completos                     |

---

## 📖 Documentación

| Para...            | Lee...                        |
| ------------------ | ----------------------------- |
| Empezar ya         | `QUICKSTART_NOTIFICATIONS.md` |
| Detalles completos | `NOTIFICATION_SYSTEM.md`      |
| Ver diagramas      | `NOTIFICATION_DIAGRAM.md`     |
| Implementar Python | `PYTHON_MS_REFERENCE.md`      |

---

## ✅ Estado

- ✅ **Backend (AdonisJS)**: 100% completo y funcional
- ⚠️ **Python MS**: Pendiente de implementar (ver `PYTHON_MS_REFERENCE.md`)
- ⚠️ **Config**: Añadir variables al `.env`

---

## 🎯 Ejemplos Rápidos

### Cancelar viaje

```typescript
trip.status = 'cancelled'
await trip.save()
```

### Reportar avería

```typescript
vehicle.status = 'maintenance' // Estados válidos: available, in_use, maintenance, retired
await vehicle.save()
```

### Confirmar pago

```typescript
await notificationService.notifyPaymentAccepted({...})
```

### Enviar resumen final

```typescript
trip.status = 'completed'
await trip.save()
```

---

**¡Listo para usar!** 🚀
