import { Server as IOServer } from 'socket.io'
import type { Server as HttpServer } from 'node:http'

export class WebSocketServer {
  public io: IOServer
  private booted = false
  constructor() {
    this.io = new IOServer()
  }

  public boot(httpServer: HttpServer) {
    if (this.booted) {
      return
    }
    this.booted = true

    this.io = new IOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
      },
    })

    this.setupListeners()
  }

  private setupListeners() {
    this.io.on('connection', (socket) => {
      console.log('Socket conectado:', socket.id)

      socket.on('mensaje', (data) => {
        console.log('Mensaje recibido:', data)
        socket.emit('respuesta', { hello: 'mundo' })
      })

      socket.on('disconnect', (reason) => {
        console.log('Socket desconectado:', socket.id, reason)
      })
    })
  }

  public broadcast(event: string, data: any) {
    this.io?.emit(event, data)
  }
}

export default new WebSocketServer()
