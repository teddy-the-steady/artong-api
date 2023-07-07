import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export function handler(event: APIGatewayProxyEvent): APIGatewayProxyResult {
  const body = event.body && JSON.parse(event.body)
  const logs = body.event.data.block.logs

  try{
    if (logs instanceof Array && logs.length > 0) {
      console.log("알케미 이벤트데이터블록로그", body.event.data.block.logs)
      
      logs.map((log)=>{
        console.log("알케미 from", log.transaction.from )
        console.log("알케미 to ", log.transaction.to)
      })
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