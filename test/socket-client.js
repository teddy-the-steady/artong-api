// Excute command: node test/socket-client.js
const WebSocket = require('ws')
const socket = new WebSocket('ws://localhost:3001')

socket.on("open", () => {
  const identifierMessage = {
    action: 'init',
    data: {
      connectorId: 315
    }
  }
  socket.send(JSON.stringify(identifierMessage))
})

socket.on("message", (data) => {
  console.log(JSON.parse(data))
})

socket.on("error", (error) => {
  console.log("error", error)
})

socket.on("close", () => {
  console.log("close")
})
