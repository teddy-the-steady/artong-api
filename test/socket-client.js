// Excute command: node test/socket-client.js
const WebSocket = require('ws')
// const socket = new WebSocket('wss://yyhdnvomg3.execute-api.ap-northeast-2.amazonaws.com/stage')
const socket = new WebSocket('ws://127.0.0.1:3001?member_id=315')

socket.on("open", () => {
  console.log("open")
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
