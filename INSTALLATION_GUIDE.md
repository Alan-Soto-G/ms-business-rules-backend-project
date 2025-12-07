# 🛠️ Instalación y Configuración - Sistema de Notificaciones

## 📋 Requisitos Previos

- ✅ Node.js 18+ instalado
- ✅ AdonisJS 6 funcionando
- ✅ Base de datos configurada
- ✅ Axios ya instalado (viene en package.json)

---

## 🚀 Paso 1: Configurar Variables de Entorno

### Añadir al archivo `.env`

```bash
# ========================================
# CONFIGURACIÓN MICROSERVICIO DE NOTIFICACIONES
# ========================================

# URL del microservicio de notificaciones (Python)
NOTIFICATION_SERVICE_URL=http://localhost:5000

# Habilitar/deshabilitar notificaciones (útil para testing)
# Valores: true | false
NOTIFICATIONS_ENABLED=true
```

### Verificar configuración en `start/env.ts`

El archivo `start/env.ts` ya está configurado con:

```typescript
NOTIFICATION_SERVICE_URL: Env.schema.string.optional(),
NOTIFICATIONS_ENABLED: Env.schema.string.optional(),
```

✅ **No necesitas modificar nada más en este archivo.**

---

## ✅ Paso 2: Verificar Archivos Creados

Todos los archivos ya están creados y listos para usar:

```
✅ app/services/notification_service.ts
✅ app/services/types/notification_types.ts
✅ app/services/helpers/notification_helpers.ts
✅ app/models/core/trip.ts (modificado con hooks)
✅ app/models/transportation/vehicle.ts (modificado con hooks)
✅ app/examples/notification_examples.ts
✅ app/examples/controller_integration_examples.ts
```

**No necesitas instalar paquetes adicionales** - Todo usa dependencias ya existentes.

---

## 🧪 Paso 3: Probar el Sistema (sin MS Python aún)

### Opción A: Modo de desarrollo sin MS Python

```bash
# En .env
NOTIFICATIONS_ENABLED=true  # Los eventos se intentarán enviar
```

Los eventos se registrarán en los logs aunque el MS Python no esté disponible:

```
[INFO] [Notification Event Sent] trip.cancelled
# o
[ERROR] [Notification Error] Failed to send event: trip.cancelled
```

### Opción B: Deshabilitar temporalmente

```bash
# En .env
NOTIFICATIONS_ENABLED=false  # No se envían notificaciones
```

Útil para desarrollo/testing inicial.

---

## 🐍 Paso 4: Implementar MS de Notificaciones (Python)

### 4.1 Crear estructura del proyecto Python

```bash
# Crear directorio
mkdir ms-notificaciones
cd ms-notificaciones

# Crear estructura
mkdir -p app/{routes,services,templates}
touch app/__init__.py
touch app/main.py
touch app/routes/events.py
touch app/services/email_service.py
touch app/services/telegram_service.py
touch requirements.txt
touch .env
```

### 4.2 Instalar dependencias

```bash
# requirements.txt
Flask==3.0.0
flask-cors==4.0.0
requests==2.31.0
python-dotenv==1.0.0

# Instalar
pip install -r requirements.txt
```

### 4.3 Implementar código base

Ver **[PYTHON_MS_REFERENCE.md](./PYTHON_MS_REFERENCE.md)** para el código completo de:

- `app/main.py` - Servidor Flask
- `app/routes/events.py` - Endpoint POST /event
- `app/services/email_service.py` - Servicio de email
- `app/services/telegram_service.py` - Servicio de Telegram

### 4.4 Configurar .env (Python)

```bash
# SMTP Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-password-de-aplicacion

# Telegram Bot
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

# App Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

### 4.5 Ejecutar MS Python

```bash
# En el directorio ms-notificaciones
python app/main.py

# Debería mostrar:
# * Running on http://0.0.0.0:5000
```

---

## 🧪 Paso 5: Probar Integración Completa

### 5.1 Verificar que MS Python está corriendo

```bash
curl http://localhost:5000/event -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "test",
    "payload": {"message": "test"},
    "timestamp": "2025-12-07T12:00:00Z"
  }'
```

Debería responder:

```json
{
  "status": "ok",
  "message": "Event received and notifications sent"
}
```

### 5.2 Probar desde AdonisJS

#### Test manual en node REPL

```bash
# En terminal, dentro del proyecto AdonisJS
node ace repl
```

```javascript
// Cargar el servicio
const notificationService = await import('./app/services/notification_service.js')

// Emitir evento de prueba
await notificationService.default.emit('test.event', {
  message: 'Prueba desde AdonisJS',
})

// Verificar logs
```

#### Test con cambio de estado

```bash
node ace repl
```

```javascript
// Cargar modelo
const { default: Trip } = await import('./app/models/core/trip.js')

// Obtener un viaje
const trip = await Trip.first()

// Cambiar estado (esto dispara el hook)
trip.status = 'cancelled'
await trip.save()

// Verificar:
// 1. Logs de AdonisJS (evento enviado)
// 2. Logs de MS Python (evento recibido)
// 3. Email/Telegram (si están configurados)
```

---

## 📧 Paso 6: Configurar Servicios de Email

### Gmail (Opción recomendada para testing)

1. **Habilitar autenticación de 2 factores** en tu cuenta de Gmail

2. **Crear contraseña de aplicación**:
   - Ir a: https://myaccount.google.com/apppasswords
   - Generar nueva contraseña
   - Copiar la contraseña

3. **Configurar en .env (Python)**:

```bash
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx  # La contraseña de aplicación
```

### Otros proveedores SMTP

```bash
# Outlook
SMTP_SERVER=smtp-mail.outlook.com
SMTP_PORT=587

# SendGrid
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587

# Mailgun
SMTP_SERVER=smtp.mailgun.org
SMTP_PORT=587
```

---

## 🤖 Paso 7: Configurar Telegram Bot

### 7.1 Crear Bot de Telegram

1. Abrir Telegram y buscar: **@BotFather**

2. Enviar comando: `/newbot`

3. Seguir instrucciones:
   - Nombre del bot: `Agencia Turismo Notificaciones`
   - Username: `agencia_turismo_bot` (debe terminar en \_bot)

4. **Copiar el token** que te da BotFather:
   ```
   123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
   ```

### 7.2 Configurar en .env (Python)

```bash
TELEGRAM_BOT_TOKEN=123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
```

### 7.3 Mapear teléfonos a chat_id

Los usuarios deben iniciar conversación con el bot:

1. Buscar el bot en Telegram
2. Enviar: `/start`
3. El bot registra su chat_id

Implementar en Python:

```python
# Webhook para registrar usuarios
@app.route('/telegram/register/<phone>', methods=['GET'])
def register_telegram(phone):
    # Guardar mapeo phone → chat_id en DB
    pass
```

---

## ✅ Paso 8: Verificación Final

### Checklist de configuración

- [ ] Variables en `.env` de AdonisJS configuradas
- [ ] MS Python implementado y corriendo en puerto 5000
- [ ] SMTP configurado (Gmail u otro)
- [ ] Telegram Bot creado (opcional)
- [ ] Test básico de notificación ejecutado
- [ ] Logs funcionando correctamente

### Test completo

```bash
# 1. Iniciar MS Python
cd ms-notificaciones
python app/main.py

# 2. Iniciar AdonisJS
cd ../ms-business-rules
node ace serve

# 3. Probar endpoint (Postman/cURL)
curl http://localhost:3333/api/trips/1 -X PATCH \
  -H "Content-Type: application/json" \
  -d '{"status": "cancelled"}'

# 4. Verificar:
# ✅ Logs de AdonisJS muestran evento enviado
# ✅ Logs de Python muestran evento recibido
# ✅ Email recibido (si está configurado)
# ✅ Telegram recibido (si está configurado)
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to notification service"

**Causa**: MS Python no está corriendo o URL incorrecta

**Solución**:

```bash
# Verificar MS Python
curl http://localhost:5000

# Verificar .env
echo $NOTIFICATION_SERVICE_URL  # Debe ser http://localhost:5000
```

### Error: "SMTP Authentication failed"

**Causa**: Contraseña incorrecta o autenticación de 2 factores no habilitada

**Solución**:

- Verificar contraseña de aplicación de Gmail
- Habilitar acceso de aplicaciones menos seguras (si no usas 2FA)

### No se envían notificaciones

**Causa**: `NOTIFICATIONS_ENABLED=false`

**Solución**:

```bash
# En .env
NOTIFICATIONS_ENABLED=true
```

### Los hooks no se ejecutan

**Causa**: No se está usando `.save()` o no hay cambios detectados

**Solución**:

```typescript
// ❌ Incorrecto
await Trip.query().where('id', 1).update({ status: 'cancelled' })

// ✅ Correcto
const trip = await Trip.find(1)
trip.status = 'cancelled'
await trip.save() // Esto dispara el hook
```

---

## 📚 Siguientes Pasos

1. ✅ Integrar en controladores existentes
   - Ver: `app/examples/controller_integration_examples.ts`

2. ✅ Añadir endpoints específicos
   - `/api/trips/:id/cancel`
   - `/api/vehicles/:id/report-breakdown`
   - `/api/activities/:id/cancel`

3. ✅ Personalizar plantillas de email/Telegram
   - Editar en MS Python

4. ✅ Configurar entorno de producción
   - Usar servicios profesionales de email (SendGrid, Mailgun)
   - Configurar SSL/TLS
   - Usar variables de entorno seguras

---

**¡Sistema listo para producción!** 🚀

Para más información, consulta:

- **[QUICKSTART_NOTIFICATIONS.md](./QUICKSTART_NOTIFICATIONS.md)** - Guía rápida
- **[NOTIFICATION_SYSTEM.md](./NOTIFICATION_SYSTEM.md)** - Documentación completa
- **[PYTHON_MS_REFERENCE.md](./PYTHON_MS_REFERENCE.md)** - Código Python completo
