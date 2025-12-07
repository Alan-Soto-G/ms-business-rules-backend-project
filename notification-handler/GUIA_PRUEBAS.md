# 🧪 GUÍA DE PRUEBAS - Sistema de Notificaciones

## ⚙️ Configuración Previa

1. **Agregar variables al `.env`:**

```env
NOTIFICATION_SERVICE_URL=http://localhost:5000
NOTIFICATIONS_ENABLED=true
```

2. **Iniciar MS de Notificaciones (Python):**

```bash
python app.py
# Debe estar corriendo en http://localhost:5000
```

3. **Iniciar MS de Negocio (AdonisJS):**

```bash
npm run dev
# Debe estar corriendo en http://localhost:3333
```

---

## 🎯 Escenarios de Prueba

### 1️⃣ Prueba: Vehículo en Mantenimiento

**Pasos:**

1. Crea un cliente con email real (tu email)
2. Crea un viaje con `status='activo'`
3. Asigna ese cliente al viaje
4. Crea un vehículo con `status='available'`
5. Crea un servicio de transporte que conecte el vehículo con el viaje
6. **Actualiza el vehículo** a `status='maintenance'` o `status='retired'`

**Resultado esperado:**

- 📧 Recibes un correo con: "🚨 Aviso importante: Avería de vehículo"

**Endpoint de prueba:**

```http
PUT /vehicles/:id
{
  "status": "maintenance"
}
```

---

### 2️⃣ Prueba: Cancelación de Viaje

**Pasos:**

1. Usa el viaje creado anteriormente (debe tener `status='active'` o `'published'`)
2. Asegúrate de que tiene clientes asignados con emails reales
3. **Actualiza el viaje** a `status='cancelled'`

**Resultado esperado:**

- 📧 Todos los clientes del viaje reciben: "❌ Viaje cancelado"

**Endpoint de prueba:**

```http
PUT /trips/:id
{
  "status": "cancelled"
}
```

**Estados válidos de Trip:** `draft`, `published`, `active`, `full`, `completed`, `cancelled`

---

### 3️⃣ Prueba: Viaje Completado con Resumen

**Pasos:**

1. Usa un viaje con `status='active'` y clientes asignados
2. **Actualiza el viaje** a `status='completed'`

**Resultado esperado:**

- 📧 Cliente principal recibe: "🎉 ¡Servicio completado!" con resumen de actividades

**Endpoint de prueba:**

```http
PUT /trips/:id
{
  "status": "completed"
}
```

**Nota:** El hook solo envía resumen si el viaje pasa de `active` → `completed`

---

### 4️⃣ Prueba: Pago Aceptado (Automático)

**Pasos:**

1. Crea una factura (`Invoice`) sin fecha de pago
2. **Actualiza la factura** agregando `paymentDate`

**Resultado esperado:**

- 📧 Cliente recibe: "✅ Pago confirmado - Factura INV-XXX"

**Endpoint de prueba:**

```http
PUT /invoices/:id
{
  "paymentDate": "2024-12-07T10:30:00"
}
```

**Hook automático:** El modelo Invoice detecta cuando se agrega `paymentDate` y envía la notificación

---

### 5️⃣ Prueba: Confirmación de Reserva (Automático)

**Pasos:**

1. Crea una reserva (`Booking`) en un hotel asociada a un viaje
2. **La reserva se crea** con POST

**Resultado esperado:**

- 📧 Cliente recibe: "✅ Reserva confirmada - Hotel Campestre"

**Endpoint de prueba:**

```http
POST /bookings
{
  "tripId": 1,
  "roomId": 5
}
```

**Hook automático:** El modelo Booking detecta la creación y envía la notificación automáticamente

---

### 6️⃣ Prueba: Cancelación de Actividad

**Pasos:**

1. Crea una actividad turística
2. Asóciala a un viaje con clientes
3. **Llama manualmente** a la notificación

**Código de prueba:**

```typescript
const clients = await getAffectedClientsFromTrip(trip)

await notificationService.notifyActivityCancelled({
  activityId: activity.id,
  activityName: activity.activityName,
  reason: 'Condiciones climáticas adversas',
  tripId: trip.id,
  tripName: trip.tripName,
  affectedClients: clients,
})
```

**Resultado esperado:**

- 📧 Clientes reciben: "❌ Actividad cancelada"

---

## 🔍 Verificación Rápida

### Revisar logs del MS de Notificaciones:

```
127.0.0.1 - - [07/Dec/2024 10:30:45] "POST /event HTTP/1.1" 200 -
```

### Revisar logs del MS de Negocio:

```
[info] Notificación enviada: vehicle.breakdown
```

### Revisar tu bandeja de correo:

- Deberías ver los correos con HTML formateado
- Logo de la agencia incluido
- Información específica del evento

---

## ⚡ Prueba Rápida con cURL

Si quieres probar directamente el MS de Notificaciones:

```bash
curl -X POST http://localhost:5000/event \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "trip.cancelled",
    "payload": {
      "tripId": 1,
      "tripName": "Tour Eje Cafetero",
      "reason": "Prueba de sistema",
      "affectedClients": [
        {
          "name": "Tu Nombre",
          "email": "tu-email@gmail.com",
          "phone": "3001234567"
        }
      ]
    }
  }'
```

---

## 📋 Estados Válidos del Sistema

### Vehicle (Vehículo)

- `available` - Disponible
- `in_use` - En uso
- `maintenance` - En mantenimiento ⚠️ **Genera alerta**
- `retired` - Retirado ⚠️ **Genera alerta**

### Trip (Viaje)

- `draft` - Borrador
- `published` - Publicado
- `active` - Activo
- `full` - Completo (sin cupos)
- `completed` - Completado 🎉 **Envía resumen**
- `cancelled` - Cancelado ❌ **Genera alerta**

---

## 📝 Checklist de Pruebas

- [ ] MS de Notificaciones corriendo en puerto 5000
- [ ] MS de Negocio corriendo en puerto 3333
- [ ] Variables en `.env` configuradas
- [ ] Prueba 1: Vehículo en mantenimiento ✅ (Hook automático)
- [ ] Prueba 2: Cancelación de viaje ✅ (Hook automático)
- [ ] Prueba 3: Viaje completado ✅ (Hook automático)
- [ ] Prueba 4: Pago aceptado ✅ (Hook automático)
- [ ] Prueba 5: Reserva confirmada ✅ (Hook automático)
- [ ] Prueba 6: Cancelación de actividad ✅ (Manual)
- [ ] Correos recibidos correctamente ✅

---

## 🐛 Solución de Problemas

**No llegan correos:**

- Verificar que `NOTIFICATIONS_ENABLED=true`
- Revisar logs del MS de Notificaciones
- Verificar que la URL sea correcta: `http://localhost:5000`

**Error "Connection refused":**

- Asegúrate de que el MS de Notificaciones esté corriendo
- Verifica el puerto 5000 esté disponible

**Hooks no se activan:**

- Verifica que estés usando `vehicle.save()` o `trip.save()`
- Los hooks solo funcionan en operaciones Lucid, no en queries crudas
