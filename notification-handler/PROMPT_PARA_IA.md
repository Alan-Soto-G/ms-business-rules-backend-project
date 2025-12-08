# PROMPT PARA IA DEL MS NOTIFICACIONES

Necesito agregar un nuevo endpoint `/event` a mi servidor Flask existente para recibir eventos del MS de Negocio (AdonisJS) y enviar correos automáticos basados en el tipo de evento.

## MI CÓDIGO ACTUAL

Tengo un servidor Flask con estos endpoints:

- `GET /health` - Health check
- `POST /send-email` - Envía correos usando Gmail API

El endpoint `/send-email` acepta:

```json
{
  "recipients": "email@ejemplo.com" | ["email1", "email2"],
  "subject": "Asunto",
  "content": "Contenido",
  "is_html": true/false
}
```

## LO QUE NECESITO

### 1. Nuevo Endpoint `/event`

Debe recibir eventos del MS de Negocio con esta estructura:

```json
{
  "eventType": "trip.cancelled",
  "payload": {
    // datos específicos del evento
  }
}
```

### 2. Tipos de Eventos a Soportar (18 total)

#### ANOMALÍAS (6 eventos)

1. **`itinerary.segment.delayed`** - Retraso en segmento de itinerario

   ```json
   {
     "tripId": 123,
     "tripName": "Tour Eje Cafetero",
     "segmentId": 45,
     "segmentType": "transporte",
     "delayMinutes": 30,
     "reason": "Tráfico pesado",
     "affectedClients": [{ "name": "Juan Pérez", "email": "juan@email.com", "phone": "3001234567" }]
   }
   ```

2. **`vehicle.breakdown`** - Avería de vehículo

   ```json
   {
     "vehicleId": 42,
     "licensePlate": "ABC-123",
     "vehicleType": "Bus turístico",
     "reason": "Falla mecánica",
     "tripId": 123,
     "tripName": "Tour Eje Cafetero",
     "affectedClients": [...]
   }
   ```

3. **`vehicle.status.changed`** - Cambio de estado de vehículo

   ```json
   {
     "vehicleId": 42,
     "licensePlate": "ABC-123",
     "oldStatus": "disponible",
     "newStatus": "maintenance",
     "tripId": 123,
     "tripName": "Tour",
     "affectedClients": [...]  // puede estar vacío
   }
   ```

4. **`driver.unavailable`** - Conductor no disponible

   ```json
   {
     "driverId": 10,
     "driverName": "Carlos López",
     "reason": "Enfermedad",
     "affectedClients": [...]
   }
   ```

5. **`flight.delayed`** - Retraso de vuelo

   ```json
   {
     "flightNumber": "AV123",
     "delayMinutes": 45,
     "reason": "Condiciones climáticas",
     "affectedClients": [...]
   }
   ```

6. **`transport.not.started`** - Transporte no iniciado
   ```json
   {
     "transportId": 78,
     "scheduledTime": "2024-12-07T08:00:00",
     "currentTime": "2024-12-07T08:15:00",
     "affectedClients": [...]
   }
   ```

#### CANCELACIONES (4 eventos)

7. **`activity.cancelled`** - Actividad cancelada

   ```json
   {
     "activityId": 15,
     "activityName": "Tour del Café",
     "reason": "Clima adverso",
     "tripId": 123,
     "tripName": "Tour Eje Cafetero",
     "affectedClients": [...]
   }
   ```

8. **`trip.cancelled`** - Viaje cancelado

   ```json
   {
     "tripId": 123,
     "tripName": "Tour Eje Cafetero",
     "reason": "Fuerza mayor",
     "affectedClients": [...]
   }
   ```

9. **`booking.cancelled`** - Reserva de hotel cancelada

   ```json
   {
     "bookingId": 89,
     "hotelName": "Hotel Campestre",
     "clientName": "Ana Torres",
     "clientEmail": "ana@email.com",
     "reason": "Cancelado por el cliente"
   }
   ```

10. **`transport.service.cancelled`** - Servicio de transporte cancelado
    ```json
    {
      "serviceId": 56,
      "serviceName": "Traslado aeropuerto",
      "affectedClients": [...]
    }
    ```

#### CONFIRMACIONES (5 eventos)

11. **`payment.accepted`** - Pago aceptado

    ```json
    {
      "invoiceId": 234,
      "invoiceNumber": "INV-2024-001",
      "amount": 250000,
      "paymentMethod": "Tarjeta de crédito",
      "clientName": "Pedro Gómez",
      "clientEmail": "pedro@email.com",
      "tripId": 123,
      "tripName": "Tour Eje Cafetero"
    }
    ```

12. **`payment.rejected`** - Pago rechazado

    ```json
    {
      "invoiceId": 234,
      "invoiceNumber": "INV-2024-001",
      "reason": "Fondos insuficientes",
      "clientEmail": "pedro@email.com"
    }
    ```

13. **`booking.confirmed`** - Reserva confirmada

    ```json
    {
      "bookingId": 89,
      "hotelName": "Hotel Campestre",
      "roomType": "Doble estándar",
      "checkInDate": "2024-12-15",
      "checkOutDate": "2024-12-18",
      "clientName": "Ana Torres",
      "clientEmail": "ana@email.com",
      "tripId": 123,
      "tripName": "Tour Eje Cafetero"
    }
    ```

14. **`trip.status.changed`** - Cambio de estado de viaje

    ```json
    {
      "tripId": 123,
      "tripName": "Tour Eje Cafetero",
      "oldStatus": "published",
      "newStatus": "active",
      "clients": [...]
    }
    ```

15. **`reservation.confirmed`** - Reservación general confirmada
    ```json
    {
      "reservationId": 67,
      "reservationType": "actividad",
      "clientEmail": "cliente@email.com"
    }
    ```

#### RESÚMENES DE SERVICIO (3 eventos)

16. **`service.completed`** - Servicio completado con resumen

    ```json
    {
      "tripId": 123,
      "tripName": "Tour Eje Cafetero",
      "startDate": "2024-12-01",
      "endDate": "2024-12-05",
      "destination": "Eje Cafetero, Colombia",
      "summary": {
        "activitiesCompleted": 8,
        "totalDistance": 450,
        "accommodations": ["Hotel Campestre", "Finca La Esperanza"],
        "highlights": [
          "Visita a plantaciones de café",
          "Avistamiento de aves exóticas",
          "Recorrido por Valle del Cocora"
        ]
      },
      "mainClient": {
        "name": "María Rodríguez",
        "email": "maria@email.com",
        "phone": "3009876543"
      }
    }
    ```

17. **`trip.started`** - Viaje iniciado

    ```json
    {
      "tripId": 123,
      "tripName": "Tour Eje Cafetero",
      "startDate": "2024-12-07",
      "clients": [...]
    }
    ```

18. **`trip.completed`** - Viaje completado
    ```json
    {
      "tripId": 123,
      "tripName": "Tour Eje Cafetero",
      "endDate": "2024-12-12",
      "clients": [...]
    }
    ```

## GUÍA PARA REDACTAR LOS CORREOS

### Principios Generales

- Usa **HTML** para los correos (con `is_html=True`)
- Tono profesional pero cercano
- Incluye emojis relevantes en los títulos (⚠️ 🚨 ❌ ✅ 🎉 🚀 ✈️ etc.)
- Siempre incluye información clara y específica
- Para anomalías: empatía y solución
- Para cancelaciones: disculpas y opciones
- Para confirmaciones: detalles completos
- Para resúmenes: agradecimiento y highlights

### Estructura HTML Recomendada

```html
<h2>🔔 Título del Evento</h2>
<p>Mensaje introductorio personalizado.</p>
<hr />
<p><strong>Detalles:</strong></p>
<ul>
  <li><strong>Campo:</strong> Valor</li>
  <li><strong>Campo:</strong> Valor</li>
</ul>
<p>Mensaje de cierre apropiado.</p>
```

### Ejemplos de Redacción por Categoría

#### Anomalías

- **Tono**: Informativo, tranquilizador
- **Asunto**: Incluir emoji de advertencia (⚠️) y nombre del viaje
- **Contenido**: Explicar problema, impacto, solución en curso
- Ejemplo: "Le informamos que se ha presentado un retraso de 30 minutos. Lamentamos los inconvenientes."

#### Cancelaciones

- **Tono**: Empático, disculpas sinceras
- **Asunto**: Incluir emoji ❌ y elemento cancelado
- **Contenido**: Razón clara, disculpas, próximos pasos (reembolso/alternativas)
- Ejemplo: "Lamentamos informarle que... Nos pondremos en contacto para gestionar el reembolso."

#### Confirmaciones

- **Tono**: Positivo, claro
- **Asunto**: Incluir emoji ✅ y elemento confirmado
- **Contenido**: Detalles completos en lista, número de confirmación
- Ejemplo: "Su pago ha sido procesado exitosamente. Detalles: Factura INV-001, Monto $250,000..."

#### Resúmenes

- **Tono**: Agradecido, celebratorio
- **Asunto**: Incluir emoji 🎉 y nombre del viaje
- **Contenido**: Resumen de actividades, highlights, agradecimiento
- Ejemplo: "Esperamos que haya disfrutado... Highlights: 8 actividades completadas..."

## REQUISITOS DE IMPLEMENTACIÓN

1. **Crear función/clase `EventHandler`** que:
   - Reciba `event_type` y `payload`
   - Tenga un método para cada tipo de evento (ej: `_handle_trip_cancelled`)
   - Llame internamente a `/send-email` con el correo generado

2. **Endpoint `/event`**:
   - Validar que el JSON tenga `eventType` y `payload`
   - Llamar al handler apropiado según el `eventType`
   - Devolver respuesta exitosa/error
   - Formato de respuesta:
     ```json
     {
       "success": true,
       "message": "Evento 'trip.cancelled' procesado exitosamente",
       "result": {...}
     }
     ```

3. **Manejo de destinatarios**:
   - Si el payload tiene `affectedClients[]`: extraer emails y enviar a todos
   - Si tiene `clientEmail`: enviar solo a ese email
   - Si tiene `clients[]`: extraer emails de ese array

4. **Manejo de errores**:
   - Si el evento es desconocido: devolver error 400
   - Si falla el envío de correo: devolver error 500 pero con detalles
   - Logs claros en consola

## EJEMPLO DE INTEGRACIÓN

El endpoint debería funcionar así:

```python
@app.route('/event', methods=['POST'])
def handle_event():
    data = request.get_json()
    event_type = data['eventType']
    payload = data['payload']

    # Procesar según tipo de evento
    result = event_handler.handle_event(event_type, payload)

    return jsonify(result)
```

## TESTING

Debe poder probarse con:

```bash
curl -X POST http://localhost:5000/event \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "trip.cancelled",
    "payload": {
      "tripId": 123,
      "tripName": "Tour Eje Cafetero",
      "reason": "Clima adverso",
      "affectedClients": [
        {"name": "Juan", "email": "test@email.com"}
      ]
    }
  }'
```

## NOTAS IMPORTANTES

- El MS de Negocio enviará estos eventos automáticamente cuando detecte cambios en los modelos
- Los correos deben ser informativos pero concisos
- Incluir siempre datos clave: nombres, IDs, fechas, razones
- Para listas de clientes, enviar un solo correo a todos (no uno por uno)
- Si algún campo del payload está vacío, usar valores por defecto ("No especificado", "N/A", etc.)

¿Puedes implementar esto en mi servidor Flask actual?
