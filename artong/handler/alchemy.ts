import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export function handler(event: APIGatewayProxyEvent): APIGatewayProxyResult {
  const body = event.body && JSON.parse(event.body)
  const logs = body.event.data.block.logs

  console.log("알케미 웹훅", body)
  console.log("알케미 이벤트", body.event)
  console.log("알케미 이벤트데이터", body.event.data)
  console.log("알케미 이벤트데이터블록", body.event.data.block)
  console.log("알케미 이벤트데이터블록로그", body.event.data.block.logs)
  if(logs instanceof Array) {
    logs.map((log)=>{
      console.log("알케미 로그트랜잭션",log.transaction)

      log.transaction.logs.map((subLog: any)=>{
        console.log("알케미 서브로그", subLog)

        subLog.topics.map((topic: any)=>{
          console.log("알케미 토픽", topic)
        })
      })
    })
  }

  return {
    statusCode: 201,
    body: 'OK',
  }
}