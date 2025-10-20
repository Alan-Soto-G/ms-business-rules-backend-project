import WebSocketServer from '../app/Services/web_socket_server.js'
import server from '@adonisjs/core/services/server'

WebSocketServer.boot(server.getNodeServer()!)

WebSocketServer.io.on('connection', (socket) => {
  console.log('Nuevo Dispositivo Conectado')

  let id = socket.id
  const body = socket.handshake.query

  console.log('Body Del Socket ' + JSON.stringify(body))
  console.log('Se Conectó ' + id)

  socket.emit('notifications', { hello: 'world' })
})
