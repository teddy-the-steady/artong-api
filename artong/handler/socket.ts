import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi'
import {APIGatewayProxyWebsocketEventV2} from 'aws-lambda'

const connect = async (event: APIGatewayProxyWebsocketEventV2) => {
  const { requestContext:{ domainName, stage, connectionId, connectedAt,routeKey } } = event
  try {
    const endpoint = process.env.IS_OFFLINE ? `http://localhost:3001` : `https://${domainName}/${stage}`

    const client = new ApiGatewayManagementApiClient({ region: 'ap-northeast-2', endpoint })
    const encoder = new TextEncoder()

    const postCommand = new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data : encoder.encode(`Hello from ${routeKey}. You connected at ${connectedAt}`)
    })

    await client.send(postCommand)
  } catch (error) {
    return {statusCode: 500}
  }
  return {statusCode: 200}
}

const disconenct = async (event:APIGatewayProxyWebsocketEventV2) => {
  console.log('disconnect event')
}
export {
  connect,
  disconenct
}