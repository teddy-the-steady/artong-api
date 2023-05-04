import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda'

const connectionManager = async (event: APIGatewayProxyWebsocketEventV2, context:AWSLambda.Context) => {
  const { requestContext:{ eventType} } = event

  if(eventType === 'CONNECT') {
    connect(event)
  } else if(eventType ==='DISCONNECT') {
    disconnect(event)
  }
}

const connect = async (event: APIGatewayProxyWebsocketEventV2 ) => {}

const disconnect = async (event: APIGatewayProxyWebsocketEventV2) => {}

export {
  connectionManager
}
