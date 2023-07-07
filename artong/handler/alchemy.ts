import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export function handler(event: APIGatewayProxyEvent): APIGatewayProxyResult {
  const body = event.body && JSON.parse(event.body)
  const logs = body.event.data.block.logs

  try{
    if (body.event.data.block.logs) {
      console.log("알케미 이벤트데이터블록로그", body.event.data.block.logs)
      console.log("알케미 from", body.event.data.block.logs.transaction.from)
      console.log("알케미 to", body.event.data.block.logs.transaction.to)
    }
  } catch(e){
    console.log("알케미 에러",e)
    return {
      statusCode: 201,
      body: 'OK',
    }
  }

  return {
    statusCode: 201,
    body: 'OK',
  }
}