# 🐍 Referencia para el Microservicio de Notificaciones (Python)

Este archivo contiene ejemplos de cómo debería ser el MS de Notificaciones en Python para recibir los eventos del MS de Negocio.

## 📦 Estructura Recomendada (Python)

```
ms-notificaciones/
├── app/
│   ├── __init__.py
│   ├── main.py                    # Punto de entrada (Flask/FastAPI)
│   ├── routes/
│   │   └── events.py              # Endpoint POST /event
│   ├── services/
│   │   ├── email_service.py       # Servicio de email
│   │   └── telegram_service.py    # Servicio de Telegram
│   ├── templates/                 # Plantillas de notificaciones
│   │   ├── vehicle_breakdown.html
│   │   ├── trip_cancelled.html
│   │   ├── activity_cancelled.html
│   │   ├── payment_accepted.html
│   │   └── service_completed.html
│   └── models/
│       └── notification.py        # Modelo para guardar histórico
├── requirements.txt
└── .env
```

## 🚀 Ejemplo con Flask

### main.py

```python
from flask import Flask
from flask_cors import CORS
from app.routes.events import events_bp

app = Flask(__name__)
CORS(app)

# Registrar blueprints
app.register_blueprint(events_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

### routes/events.py

```python
from flask import Blueprint, request, jsonify
from app.services.email_service import send_email
from app.services.telegram_service import send_telegram
from datetime import datetime
import logging

events_bp = Blueprint('events', __name__)
logger = logging.getLogger(__name__)

@events_bp.route('/event', methods=['POST'])
def receive_event():
    """
    Endpoint para recibir eventos del MS de Negocio
    """
    try:
        data = request.get_json()

        event_type = data.get('event_type')
        payload = data.get('payload')
        timestamp = data.get('timestamp', datetime.utcnow().isoformat())

        logger.info(f"Evento recibido: {event_type}")

        # Procesar según el tipo de evento
        if event_type == 'vehicle.breakdown':
            handle_vehicle_breakdown(payload)

        elif event_type == 'trip.cancelled':
            handle_trip_cancelled(payload)

        elif event_type == 'activity.cancelled':
            handle_activity_cancelled(payload)

        elif event_type == 'payment.accepted':
            handle_payment_accepted(payload)

        elif event_type == 'booking.confirmed':
            handle_booking_confirmed(payload)

        elif event_type == 'itinerary.segment.delayed':
            handle_itinerary_delayed(payload)

        elif event_type == 'service.completed':
            handle_service_completed(payload)

        elif event_type == 'trip.status.changed':
            handle_trip_status_changed(payload)

        elif event_type == 'vehicle.status.changed':
            handle_vehicle_status_changed(payload)

        else:
            logger.warning(f"Tipo de evento no manejado: {event_type}")
            return jsonify({
                'status': 'warning',
                'message': f'Event type {event_type} not handled'
            }), 200

        return jsonify({
            'status': 'ok',
            'message': 'Event received and notifications sent'
        }), 200

    except Exception as e:
        logger.error(f"Error procesando evento: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


def handle_vehicle_breakdown(payload):
    """Maneja avería de vehículo"""
    vehicle_plate = payload.get('licensePlate')
    trip_name = payload.get('tripName')
    reason = payload.get('reason')
    affected_clients = payload.get('affectedClients', [])

    # Plantilla de email
    subject = f"⚠️ Alerta: Avería de vehículo - {trip_name}"

    for client in affected_clients:
        # Email
        email_body = f"""
        Estimado/a {client['name']},

        Le informamos que el vehículo {vehicle_plate} asignado a su viaje
        "{trip_name}" ha presentado una avería.

        Motivo: {reason}

        Nuestro equipo está trabajando para solucionar esta situación lo antes posible.
        Le mantendremos informado sobre las acciones correctivas.

        Agencia de Turismo
        """

        send_email(
            to=client['email'],
            subject=subject,
            body=email_body
        )

        # Telegram (si tiene phone)
        if client.get('phone'):
            telegram_msg = f"""
            🚨 ALERTA DE VIAJE

            Vehículo: {vehicle_plate}
            Viaje: {trip_name}
            Estado: Averiado

            Motivo: {reason}

            Estamos trabajando para resolverlo.
            """
            send_telegram(client['phone'], telegram_msg)


def handle_trip_cancelled(payload):
    """Maneja cancelación de viaje"""
    trip_name = payload.get('tripName')
    reason = payload.get('reason')
    affected_clients = payload.get('affectedClients', [])

    subject = f"❌ Cancelación de viaje: {trip_name}"

    for client in affected_clients:
        email_body = f"""
        Estimado/a {client['name']},

        Lamentamos informarle que el viaje "{trip_name}" ha sido cancelado.

        Motivo: {reason}

        Nos pondremos en contacto con usted para gestionar el reembolso
        o reprogramación del viaje.

        Disculpe las molestias.

        Agencia de Turismo
        """

        send_email(client['email'], subject, email_body)

        if client.get('phone'):
            send_telegram(client['phone'],
                f"❌ Viaje '{trip_name}' CANCELADO. Motivo: {reason}. "
                f"Le contactaremos pronto.")


def handle_activity_cancelled(payload):
    """Maneja cancelación de actividad"""
    activity_name = payload.get('activityName')
    trip_name = payload.get('tripName')
    reason = payload.get('reason')
    affected_clients = payload.get('affectedClients', [])

    subject = f"Cancelación de actividad: {activity_name}"

    for client in affected_clients:
        email_body = f"""
        Estimado/a {client['name']},

        La actividad "{activity_name}" programada en su viaje "{trip_name}"
        ha sido cancelada.

        Motivo: {reason}

        Estamos buscando alternativas para su experiencia.

        Agencia de Turismo
        """

        send_email(client['email'], subject, email_body)


def handle_payment_accepted(payload):
    """Maneja confirmación de pago"""
    client_name = payload.get('clientName')
    client_email = payload.get('clientEmail')
    invoice_number = payload.get('invoiceNumber')
    amount = payload.get('amount')
    trip_name = payload.get('tripName')

    subject = f"✅ Pago confirmado - Factura #{invoice_number}"

    email_body = f"""
    Estimado/a {client_name},

    Hemos recibido su pago correctamente.

    Factura: #{invoice_number}
    Monto: ${amount:,.2f}
    Viaje: {trip_name}

    Gracias por su pago.

    Agencia de Turismo
    """

    send_email(client_email, subject, email_body)


def handle_service_completed(payload):
    """Maneja finalización de servicio - Envía resumen"""
    trip_name = payload.get('tripName')
    start_date = payload.get('startDate')
    end_date = payload.get('endDate')
    destination = payload.get('destination')
    summary = payload.get('summary', {})
    main_client = payload.get('mainClient', {})

    subject = f"🎉 Resumen de su viaje: {trip_name}"

    email_body = f"""
    Estimado/a {main_client['name']},

    Su viaje "{trip_name}" ha finalizado exitosamente.

    📅 Fechas: {start_date} - {end_date}
    📍 Destino: {destination}

    Resumen:
    • Actividades completadas: {summary.get('activitiesCompleted', 0)}
    • Alojamientos: {', '.join(summary.get('accommodations', []))}

    Momentos destacados:
    {chr(10).join(['• ' + h for h in summary.get('highlights', [])])}

    Esperamos que haya disfrutado su experiencia.
    ¡Gracias por viajar con nosotros!

    Agencia de Turismo
    """

    send_email(main_client['email'], subject, email_body)


def handle_itinerary_delayed(payload):
    """Maneja retraso en itinerario"""
    trip_name = payload.get('tripName')
    segment_type = payload.get('segmentType')
    delay_minutes = payload.get('delayMinutes')
    reason = payload.get('reason', 'No especificado')
    affected_clients = payload.get('affectedClients', [])

    subject = f"⏰ Retraso en itinerario - {trip_name}"

    for client in affected_clients:
        email_body = f"""
        Estimado/a {client['name']},

        Le informamos de un retraso en su itinerario de viaje.

        Viaje: {trip_name}
        Transporte: {segment_type}
        Retraso estimado: {delay_minutes} minutos
        Motivo: {reason}

        Lamentamos las molestias.

        Agencia de Turismo
        """

        send_email(client['email'], subject, email_body)


def handle_booking_confirmed(payload):
    """Maneja confirmación de reserva"""
    client_name = payload.get('clientName')
    client_email = payload.get('clientEmail')
    hotel_name = payload.get('hotelName')
    room_type = payload.get('roomType')
    check_in = payload.get('checkInDate')
    check_out = payload.get('checkOutDate')

    subject = f"✅ Reserva confirmada - {hotel_name}"

    email_body = f"""
    Estimado/a {client_name},

    Su reserva ha sido confirmada.

    Hotel: {hotel_name}
    Tipo de habitación: {room_type}
    Check-in: {check_in}
    Check-out: {check_out}

    ¡Esperamos que disfrute su estadía!

    Agencia de Turismo
    """

    send_email(client_email, subject, email_body)


def handle_trip_status_changed(payload):
    """Maneja cambio de estado de viaje"""
    trip_name = payload.get('tripName')
    old_status = payload.get('oldStatus')
    new_status = payload.get('newStatus')
    clients = payload.get('clients', [])

    # Solo notificar cambios importantes
    important_statuses = ['active', 'cancelled', 'completed']
    if new_status not in important_statuses:
        return

    status_messages = {
        'active': '🚀 Su viaje ha comenzado',
        'cancelled': '❌ Su viaje ha sido cancelado',
        'completed': '🎉 Su viaje ha finalizado'
    }

    subject = f"{status_messages.get(new_status, 'Actualización de viaje')}: {trip_name}"

    for client in clients:
        email_body = f"""
        Estimado/a {client['name']},

        Estado del viaje "{trip_name}" actualizado.

        Estado anterior: {old_status}
        Estado actual: {new_status}

        Agencia de Turismo
        """

        send_email(client['email'], subject, email_body)


def handle_vehicle_status_changed(payload):
    """Maneja cambio de estado de vehículo (solo log)"""
    # Este evento generalmente solo se loguea, no se notifica al cliente
    logger.info(f"Vehículo {payload.get('licensePlate')} cambió de "
                f"{payload.get('oldStatus')} a {payload.get('newStatus')}")
```

### services/email_service.py

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

logger = logging.getLogger(__name__)

def send_email(to: str, subject: str, body: str):
    """Envía email usando SMTP"""
    try:
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', 587))
        smtp_user = os.getenv('SMTP_USER')
        smtp_password = os.getenv('SMTP_PASSWORD')

        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = to
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)

        logger.info(f"Email enviado a {to}")

    except Exception as e:
        logger.error(f"Error enviando email a {to}: {str(e)}")
```

### services/telegram_service.py

```python
import requests
import os
import logging

logger = logging.getLogger(__name__)

def send_telegram(phone: str, message: str):
    """Envía mensaje por Telegram Bot API"""
    try:
        bot_token = os.getenv('TELEGRAM_BOT_TOKEN')

        # Aquí necesitarías un sistema para mapear phone -> chat_id
        # O usar un webhook para que los usuarios se registren
        chat_id = get_chat_id_from_phone(phone)

        if not chat_id:
            logger.warning(f"Chat ID no encontrado para {phone}")
            return

        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"

        data = {
            'chat_id': chat_id,
            'text': message,
            'parse_mode': 'Markdown'
        }

        response = requests.post(url, json=data)
        response.raise_for_status()

        logger.info(f"Telegram enviado a {phone}")

    except Exception as e:
        logger.error(f"Error enviando Telegram a {phone}: {str(e)}")


def get_chat_id_from_phone(phone: str):
    """Obtiene el chat_id de Telegram desde el teléfono"""
    # Implementar lógica de base de datos o caché
    # Esta es solo una función de ejemplo
    pass
```

## 🔧 requirements.txt

```txt
Flask==3.0.0
flask-cors==4.0.0
requests==2.31.0
python-dotenv==1.0.0
```

## 📝 .env (Ejemplo)

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

## 🚀 Para ejecutar

```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python main.py

# O con gunicorn en producción
gunicorn -w 4 -b 0.0.0.0:5000 app.main:app
```

---

**Este es un ejemplo completo del microservicio de notificaciones en Python** que recibirá los eventos del MS de Negocio (AdonisJS). 🎉
