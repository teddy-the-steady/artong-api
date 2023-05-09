// Excute command: node test/socket-client.js
const WebSocket = require('ws')
const socket = new WebSocket('ws://localhost:3001')

socket.on("open", () => {
  const identifierMessage = {
    type: 'IDENTIFIER',
    userId: 315
  }

  socket.send(JSON.stringify(identifierMessage))
})