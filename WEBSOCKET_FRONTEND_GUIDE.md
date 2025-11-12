# 🔌 Guía Completa: Usar WebSockets desde el Frontend

## 📦 Instalación en el Frontend

### Para Angular 20:
```bash
npm install socket.io-client
npm install --save-dev @types/socket.io-client
```

### Para React/Vue:
```bash
npm install socket.io-client
```

### Para HTML puro:
```html
<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
```

---

## 🚀 Ejemplos de Uso

### **1. Angular 20 (Standalone Components + Signals)**

#### **Paso 1: Crear el Servicio de WebSocket**

```typescript
// src/app/services/websocket.service.ts
import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

/**
 * Servicio para gestionar la conexión WebSocket usando Socket.io
 * Utiliza Signals de Angular para manejar el estado reactivo
 */
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket | null = null;
  private destroyRef = inject(DestroyRef);

  // Signals para estado reactivo
  private connectedSignal = signal<boolean>(false);
  private socketIdSignal = signal<string | undefined>(undefined);
  private notificationsSignal = signal<any[]>([]);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  public connected = this.connectedSignal.asReadonly();
  public socketId = this.socketIdSignal.asReadonly();
  public notifications = this.notificationsSignal.asReadonly();
  public error = this.errorSignal.asReadonly();
  
  // Contador de notificaciones sin leer
  public unreadCount = computed(() => this.notificationsSignal().length);

  constructor() {
    // Cleanup automático cuando se destruye el servicio
    this.destroyRef.onDestroy(() => {
      this.disconnect();
    });
  }

  /**
   * Conectar al servidor WebSocket
   * @param userId - ID del usuario (opcional)
   * @param token - Token de autenticación (opcional)
   */
  connect(userId?: string, token?: string): void {
    if (this.socket?.connected) {
      console.warn('Ya existe una conexión activa');
      return;
    }

    const url = environment.backendUrl || 'http://localhost:3333';

    this.socket = io(url, {
      query: {
        userId: userId || '',
        token: token || ''
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 10000
    });

    this.setupListeners();
  }

  /**
   * Configurar todos los listeners de eventos del servidor
   */
  private setupListeners(): void {
    if (!this.socket) return;

    // Evento: Conexión exitosa
    this.socket.on('connect', () => {
      console.log('✅ Conectado al servidor:', this.socket?.id);
      this.connectedSignal.set(true);
      this.socketIdSignal.set(this.socket?.id);
      this.errorSignal.set(null);
    });

    // Evento: Notificaciones del servidor
    this.socket.on('notifications', (data: any) => {
      console.log('🔔 Notificación recibida:', data);
      this.notificationsSignal.update(notifications => [...notifications, data]);
    });

    // Evento: Respuesta del servidor
    this.socket.on('respuesta', (data: any) => {
      console.log('📨 Respuesta del servidor:', data);
    });

    // Evento: Aerolínea creada (ejemplo personalizado)
    this.socket.on('airline_created', (data: any) => {
      console.log('✈️ Nueva aerolínea creada:', data);
      this.notificationsSignal.update(notifications => [...notifications, {
        type: 'airline_created',
        data: data,
        timestamp: new Date()
      }]);
    });

    // Evento: Trip actualizado (ejemplo personalizado)
    this.socket.on('trip_updated', (data: any) => {
      console.log('🚗 Trip actualizado:', data);
      this.notificationsSignal.update(notifications => [...notifications, {
        type: 'trip_updated',
        data: data,
        timestamp: new Date()
      }]);
    });

    // Evento: Desconexión
    this.socket.on('disconnect', (reason: string) => {
      console.log('❌ Desconectado:', reason);
      this.connectedSignal.set(false);
      this.socketIdSignal.set(undefined);

      if (reason === 'io server disconnect') {
        // El servidor cerró la conexión, reconectar manualmente
        this.socket?.connect();
      }
    });

    // Evento: Error de conexión
    this.socket.on('connect_error', (error: Error) => {
      console.error('⚠️ Error de conexión:', error.message);
      this.errorSignal.set(error.message);
      this.connectedSignal.set(false);
    });

    // Evento: Intentando reconectar
    this.socket.on('reconnect_attempt', (attemptNumber: number) => {
      console.log(`🔄 Intento de reconexión #${attemptNumber}`);
    });

    // Evento: Reconexión exitosa
    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log(`✅ Reconectado después de ${attemptNumber} intentos`);
      this.errorSignal.set(null);
    });

    // Evento: Falló la reconexión
    this.socket.on('reconnect_failed', () => {
      console.error('❌ Falló la reconexión');
      this.errorSignal.set('No se pudo reconectar al servidor');
    });
  }

  /**
   * Enviar un mensaje al servidor
   * @param event - Nombre del evento
   * @param data - Datos a enviar
   */
  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
      console.log(`📤 Enviado evento '${event}':`, data);
    } else {
      console.warn('⚠️ Socket no conectado. No se puede enviar el evento:', event);
      this.errorSignal.set('No hay conexión con el servidor');
    }
  }

  /**
   * Escuchar un evento personalizado específico
   * @param event - Nombre del evento
   * @param callback - Función a ejecutar cuando se reciba el evento
   */
  on(event: string, callback: (data: any) => void): void {
    this.socket?.on(event, callback);
  }

  /**
   * Dejar de escuchar un evento específico
   * @param event - Nombre del evento
   */
  off(event: string): void {
    this.socket?.off(event);
  }

  /**
   * Desconectar del servidor
   */
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Desconectando...');
      this.socket.disconnect();
      this.socket = null;
      this.connectedSignal.set(false);
      this.socketIdSignal.set(undefined);
      this.notificationsSignal.set([]);
    }
  }

  /**
   * Limpiar todas las notificaciones
   */
  clearNotifications(): void {
    this.notificationsSignal.set([]);
  }

  /**
   * Eliminar una notificación específica
   * @param index - Índice de la notificación a eliminar
   */
  removeNotification(index: number): void {
    this.notificationsSignal.update(notifications => 
      notifications.filter((_, i) => i !== index)
    );
  }

  /**
   * Verificar si está conectado (método alternativo)
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Obtener el ID del socket (método alternativo)
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Escuchar todos los eventos (útil para debugging)
   */
  enableDebugMode(): void {
    this.socket?.onAny((event, ...args) => {
      console.log(`📥 Evento recibido: ${event}`, args);
    });

    this.socket?.onAnyOutgoing((event, ...args) => {
      console.log(`📤 Evento enviado: ${event}`, args);
    });
  }
}
```

#### **Paso 2: Configurar los Environments**

```typescript
// src/environments/environment.ts (desarrollo)
export const environment = {
  production: false,
  backendUrl: 'http://localhost:3333'
};

// src/environments/environment.prod.ts (producción)
export const environment = {
  production: true,
  backendUrl: 'https://tu-backend.com'
};
```

#### **Paso 3: Componente para Mostrar Notificaciones**

```typescript
// src/app/components/notification-panel/notification-panel.component.ts
import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-panel">
      <div class="header">
        <h2>WebSocket Status</h2>
        <span [class]="connected() ? 'status-connected' : 'status-disconnected'">
          {{ connected() ? '🟢 Conectado' : '🔴 Desconectado' }}
        </span>
      </div>

      @if (socketId()) {
        <p class="socket-id">Socket ID: {{ socketId() }}</p>
      }

      @if (error()) {
        <div class="error-message">
          ⚠️ Error: {{ error() }}
        </div>
      }

      <div class="actions">
        <button (click)="sendTestMessage()" [disabled]="!connected()">
          📤 Enviar Mensaje de Prueba
        </button>
        <button (click)="clearNotifications()" [disabled]="unreadCount() === 0">
          🗑️ Limpiar ({{ unreadCount() }})
        </button>
      </div>

      <div class="notifications">
        <h3>Notificaciones ({{ unreadCount() }})</h3>
        
        @if (notifications().length === 0) {
          <p class="no-notifications">No hay notificaciones</p>
        } @else {
          <ul>
            @for (notification of notifications(); track $index) {
              <li class="notification-item">
                <span class="notification-content">
                  {{ notification | json }}
                </span>
                <button 
                  class="btn-remove" 
                  (click)="removeNotification($index)"
                  title="Eliminar">
                  ❌
                </button>
              </li>
            }
          </ul>
        }
      </div>
    </div>
  `,
  styles: [`
    .notification-panel {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #f9f9f9;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .header h2 {
      margin: 0;
    }

    .status-connected {
      color: #22c55e;
      font-weight: bold;
    }

    .status-disconnected {
      color: #ef4444;
      font-weight: bold;
    }

    .socket-id {
      font-size: 0.9em;
      color: #666;
      margin-bottom: 15px;
    }

    .error-message {
      background: #fee;
      border: 1px solid #fcc;
      padding: 10px;
      border-radius: 4px;
      color: #c00;
      margin-bottom: 15px;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .actions button {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 4px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
      font-weight: bold;
    }

    .actions button:hover:not(:disabled) {
      background: #2563eb;
    }

    .actions button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .notifications h3 {
      margin-bottom: 10px;
    }

    .no-notifications {
      color: #999;
      font-style: italic;
    }

    .notifications ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .notification-item {
      display: flex;
      justify-content: space-between;
      align-items: start;
      padding: 10px;
      margin-bottom: 8px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .notification-content {
      flex: 1;
      word-break: break-word;
      font-family: monospace;
      font-size: 0.9em;
    }

    .btn-remove {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0 5px;
      font-size: 1em;
    }

    .btn-remove:hover {
      transform: scale(1.2);
    }
  `]
})
export class NotificationPanelComponent implements OnInit {
  private wsService = inject(WebsocketService);

  // Exponer signals del servicio
  connected = this.wsService.connected;
  socketId = this.wsService.socketId;
  notifications = this.wsService.notifications;
  error = this.wsService.error;
  unreadCount = this.wsService.unreadCount;

  constructor() {
    // Effect para reaccionar a cambios en las notificaciones
    effect(() => {
      const count = this.unreadCount();
      if (count > 0) {
        console.log(`Tienes ${count} notificaciones sin leer`);
      }
    });
  }

  ngOnInit(): void {
    // Conectar al WebSocket al inicializar
    const userId = localStorage.getItem('userId') || undefined;
    const token = localStorage.getItem('token') || undefined;
    
    this.wsService.connect(userId, token);
    
    // Habilitar modo debug (opcional)
    // this.wsService.enableDebugMode();
  }

  sendTestMessage(): void {
    this.wsService.emit('mensaje', {
      texto: 'Hola desde Angular 20!',
      timestamp: new Date().toISOString(),
      user: 'Alan'
    });
  }

  clearNotifications(): void {
    this.wsService.clearNotifications();
  }

  removeNotification(index: number): void {
    this.wsService.removeNotification(index);
  }
}
```

#### **Paso 4: Integrar en el App Component**

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { NotificationPanelComponent } from './components/notification-panel/notification-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificationPanelComponent],
  template: `
    <div class="app-container">
      <h1>Mi Aplicación con WebSockets</h1>
      <app-notification-panel />
    </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    h1 {
      text-align: center;
      color: #333;
    }
  `]
})
export class AppComponent {
  title = 'Angular WebSocket App';
}
```

#### **Paso 5: Ejemplo de Uso en un Componente de Lista**

```typescript
// src/app/components/airline-list/airline-list.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../../services/websocket.service';

interface Airline {
  id: number;
  name: string;
  code: string;
}

@Component({
  selector: 'app-airline-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="airline-list">
      <h2>Lista de Aerolíneas</h2>
      
      <ul>
        @for (airline of airlines(); track airline.id) {
          <li>
            <strong>{{ airline.name }}</strong> ({{ airline.code }})
          </li>
        } @empty {
          <li>No hay aerolíneas</li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .airline-list {
      max-width: 400px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      padding: 10px;
      margin: 5px 0;
      background: #f0f0f0;
      border-radius: 4px;
    }
  `]
})
export class AirlineListComponent implements OnInit {
  private http = inject(HttpClient);
  private wsService = inject(WebsocketService);
  
  airlines = signal<Airline[]>([]);

  ngOnInit(): void {
    // Cargar lista inicial
    this.loadAirlines();

    // Escuchar cuando se crea una nueva aerolínea en tiempo real
    this.wsService.on('airline_created', (data) => {
      console.log('Nueva aerolínea recibida por WebSocket:', data);
      
      // Agregar la nueva aerolínea a la lista
      if (data.data) {
        this.airlines.update(current => [...current, data.data]);
      }
    });
  }

  private loadAirlines(): void {
    this.http.get<Airline[]>('http://localhost:3333/airlines')
      .subscribe({
        next: (data) => this.airlines.set(data),
        error: (err) => console.error('Error cargando aerolíneas:', err)
      });
  }
}
```

#### **Paso 6: Guard para Verificar Conexión (Opcional)**

```typescript
// src/app/guards/websocket-connected.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';

/**
 * Guard para verificar que existe conexión WebSocket
 */
export const websocketConnectedGuard: CanActivateFn = (route, state) => {
  const wsService = inject(WebsocketService);
  const router = inject(Router);

  if (!wsService.isConnected()) {
    console.warn('No hay conexión WebSocket');
    return router.createUrlTree(['/error']);
  }

  return true;
};
```

---

### **2. React/Next.js**

```typescript
// services/socketService.ts
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  
  /**
   * Conectar al servidor WebSocket
   * @param userId - ID del usuario (opcional)
   * @param token - Token de autenticación (opcional)
   */
  connect(userId?: string, token?: string) {
    // URL de tu backend
    const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3333';
    
    // Conectar con parámetros opcionales
    this.socket = io(url, {
      query: {
        userId: userId || '',
        token: token || ''
      },
      transports: ['websocket', 'polling'], // Intenta websocket primero
      reconnection: true, // Reconectar automáticamente
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.setupListeners();
  }

  /**
   * Configurar listeners de eventos del servidor
   */
  private setupListeners() {
    if (!this.socket) return;

    // Evento: Conexión exitosa
    this.socket.on('connect', () => {
      console.log('✅ Conectado al servidor:', this.socket?.id);
    });

    // Evento: Notificaciones del servidor (desde start/socket.ts)
    this.socket.on('notifications', (data) => {
      console.log('🔔 Notificación recibida:', data);
      // Aquí puedes mostrar una notificación en la UI
    });

    // Evento: Respuesta del servidor (desde setupListeners)
    this.socket.on('respuesta', (data) => {
      console.log('📨 Respuesta del servidor:', data);
    });

    // Evento: Desconexión
    this.socket.on('disconnect', (reason) => {
      console.log('❌ Desconectado:', reason);
      if (reason === 'io server disconnect') {
        // El servidor cerró la conexión, reconectar manualmente
        this.socket?.connect();
      }
    });

    // Evento: Error de conexión
    this.socket.on('connect_error', (error) => {
      console.error('⚠️ Error de conexión:', error.message);
    });
  }

  /**
   * Enviar un mensaje al servidor
   * @param event - Nombre del evento
   * @param data - Datos a enviar
   */
  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket no conectado');
    }
  }

  /**
   * Escuchar un evento específico
   * @param event - Nombre del evento
   * @param callback - Función a ejecutar cuando se reciba el evento
   */
  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  /**
   * Dejar de escuchar un evento
   * @param event - Nombre del evento
   */
  off(event: string) {
    this.socket?.off(event);
  }

  /**
   * Desconectar del servidor
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Obtener el ID del socket
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

// Exportar instancia singleton
export const socketService = new SocketService();
```

### **2. Uso en un Componente React**

```typescript
// components/NotificationListener.tsx
import { useEffect, useState } from 'react';
import { socketService } from '../services/socketService';

export function NotificationListener() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Conectar al montar el componente
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    socketService.connect(userId || undefined, token || undefined);

    // Escuchar conexión
    socketService.on('connect', () => {
      setConnected(true);
    });

    // Escuchar notificaciones
    socketService.on('notifications', (data) => {
      setNotifications(prev => [...prev, data]);
      // Mostrar toast o notificación
      alert(`Nueva notificación: ${JSON.stringify(data)}`);
    });

    // Limpiar al desmontar
    return () => {
      socketService.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socketService.emit('mensaje', { 
      texto: 'Hola desde el frontend',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div>
      <h2>Estado: {connected ? '🟢 Conectado' : '🔴 Desconectado'}</h2>
      <button onClick={sendMessage}>Enviar Mensaje</button>
      
      <h3>Notificaciones:</h3>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{JSON.stringify(notif)}</li>
        ))}
      </ul>
    </div>
  );
}
```

### **3. Vue.js (Composition API)**

```typescript
// composables/useSocket.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const socket = ref<Socket | null>(null);
  const connected = ref(false);
  const notifications = ref<any[]>([]);

  const connect = (userId?: string, token?: string) => {
    socket.value = io('http://localhost:3333', {
      query: { userId, token }
    });

    socket.value.on('connect', () => {
      connected.value = true;
      console.log('Conectado');
    });

    socket.value.on('notifications', (data) => {
      notifications.value.push(data);
    });

    socket.value.on('disconnect', () => {
      connected.value = false;
    });
  };

  const emit = (event: string, data: any) => {
    socket.value?.emit(event, data);
  };

  const disconnect = () => {
    socket.value?.disconnect();
  };

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    socket,
    connected,
    notifications,
    emit,
    disconnect
  };
}
```

### **4. HTML + JavaScript Puro**

```html
<!DOCTYPE html>
<html>
<head>
  <title>WebSocket Test</title>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <h1>WebSocket Test</h1>
  <div id="status">Estado: Desconectado</div>
  <button onclick="sendMessage()">Enviar Mensaje</button>
  <div id="messages"></div>

  <script>
    // Conectar al servidor
    const socket = io('http://localhost:3333', {
      query: {
        userId: '123',
        token: 'abc'
      }
    });

    // Conexión exitosa
    socket.on('connect', () => {
      console.log('Conectado:', socket.id);
      document.getElementById('status').textContent = 'Estado: ✅ Conectado';
    });

    // Escuchar notificaciones
    socket.on('notifications', (data) => {
      console.log('Notificación:', data);
      const div = document.createElement('div');
      div.textContent = JSON.stringify(data);
      document.getElementById('messages').appendChild(div);
    });

    // Escuchar respuestas
    socket.on('respuesta', (data) => {
      console.log('Respuesta:', data);
      alert('Respuesta: ' + JSON.stringify(data));
    });

    // Desconexión
    socket.on('disconnect', (reason) => {
      console.log('Desconectado:', reason);
      document.getElementById('status').textContent = 'Estado: ❌ Desconectado';
    });

    // Función para enviar mensaje
    function sendMessage() {
      socket.emit('mensaje', { 
        texto: 'Hola desde HTML',
        timestamp: new Date().toISOString()
      });
    }
  </script>
</body>
</html>
```

---

## 🔄 Flujo Completo de Comunicación

```
FRONTEND                          BACKEND
   |                                 |
   |-- connect() ------------------->| (start/socket.ts)
   |                                 | WebSocketServer.boot()
   |<---- emit('notifications') -----|
   |                                 |
   |-- emit('mensaje', data) ------->| socket.on('mensaje')
   |                                 | (setupListeners)
   |<---- emit('respuesta', data) ---|
   |                                 |
   |<---- broadcast('evento') -------| (desde cualquier parte del backend)
   |                                 |
   |-- disconnect() ---------------->|
```

---

## 📚 Eventos Disponibles en tu Backend

### **Eventos que puedes ESCUCHAR desde el frontend:**
- `connect` - Cuando te conectas
- `disconnect` - Cuando te desconectas
- `notifications` - Notificaciones enviadas desde `start/socket.ts`
- `respuesta` - Respuestas a tus mensajes (desde `setupListeners`)

### **Eventos que puedes ENVIAR desde el frontend:**
- `mensaje` - Tu backend lo escucha en `setupListeners`
- Cualquier otro evento personalizado que agregues

---

## 🎯 Casos de Uso Comunes

### **1. Notificaciones en Tiempo Real**
```typescript
// Desde cualquier controlador de tu backend:
import WebSocketServer from '#services/web_socket_server'

// En AirlinesController.store() después de crear una aerolínea:
WebSocketServer.broadcast('airline_created', {
  message: 'Nueva aerolínea creada',
  airline: airline
});
```

```typescript
// En el frontend:
socketService.on('airline_created', (data) => {
  toast.success(data.message);
  // Actualizar la lista de aerolíneas
});
```

### **2. Chat en Tiempo Real**
```typescript
// Backend (agregar en start/socket.ts):
socket.on('chat_message', (data) => {
  WebSocketServer.io.emit('new_message', {
    user: data.user,
    message: data.message,
    timestamp: new Date()
  });
});
```

```typescript
// Frontend:
socketService.emit('chat_message', { user: 'Alan', message: 'Hola!' });
socketService.on('new_message', (msg) => console.log(msg));
```

### **3. Actualización de Estado en Tiempo Real**
```typescript
// Backend: Cuando se actualiza un trip
WebSocketServer.broadcast('trip_updated', { tripId: trip.id, status: trip.status });

// Frontend: Actualizar UI automáticamente
socketService.on('trip_updated', ({ tripId, status }) => {
  updateTripInList(tripId, status);
});
```

---

## ⚙️ Variables de Entorno

Asegúrate de tener en tu `.env`:

```env
# Backend
FRONTEND_URL=http://localhost:3000
PORT=3333

# Frontend (.env.local)
NEXT_PUBLIC_BACKEND_URL=http://localhost:3333
```

---

## 🔒 Seguridad

### **Autenticación con Token:**

```typescript
// Backend: En start/socket.ts
WebSocketServer.io.use(async (socket, next) => {
  const token = socket.handshake.query.token;
  
  if (!token) {
    return next(new Error('Token requerido'));
  }
  
  try {
    // Verificar token (ajusta según tu sistema de auth)
    // const user = await verifyToken(token);
    // socket.data.user = user;
    next();
  } catch (error) {
    next(new Error('Token inválido'));
  }
});
```

```typescript
// Frontend:
const token = getAuthToken();
socketService.connect(userId, token);
```

---

## 🐛 Debug

Para ver todos los eventos:

```typescript
// Frontend:
socket.onAny((event, ...args) => {
  console.log(`Evento recibido: ${event}`, args);
});

socket.onAnyOutgoing((event, ...args) => {
  console.log(`Evento enviado: ${event}`, args);
});
```

---

## ✅ Checklist de Implementación

- [ ] Instalar `socket.io-client` en el frontend
- [ ] Crear servicio de socket en el frontend
- [ ] Conectar al montar la aplicación
- [ ] Escuchar eventos necesarios
- [ ] Desconectar al desmontar
- [ ] Agregar eventos personalizados en `start/socket.ts`
- [ ] Usar `WebSocketServer.broadcast()` desde controladores
- [ ] Configurar CORS correctamente (ya lo tienes con `FRONTEND_URL`)
- [ ] Manejar reconexiones automáticas
- [ ] Agregar autenticación si es necesario
