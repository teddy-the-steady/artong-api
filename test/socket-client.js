// Excute command: node test/socket-client.js
const WebSocket = require('ws')
const socket = new WebSocket('ws://localhost:3001')

socket.on("open", () => {
  const identifierMessage = {
    connectorId: 315
  }

  socket.send(JSON.stringify(identifierMessage))
})