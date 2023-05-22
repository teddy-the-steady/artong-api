// Excute command: node test/socket-client.js
const WebSocket = require('ws')
const socket = new WebSocket('wss://yyhdnvomg3.execute-api.ap-northeast-2.amazonaws.com/stage')

socket.on("open", () => {
  console.log("connected")
  // const identifierMessage = {
  //   action: 'init',
  //   data: { connectorId: 315 }
  // }

  // socket.send(JSON.stringify(identifierMessage))
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
