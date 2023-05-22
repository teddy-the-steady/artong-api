import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda'
import * as db from '../utils/db/db';
import { Pool, PoolClient } from 'pg';
import { Notification } from '../models';
import { getDbConnentionPool } from '../init';
import { InternalServerError } from '../utils/error/errors';
import { CreateSocketConnectionBody, SocketBody } from '../models/socket/socket.type';
import { Socket } from '../models/socket/Socket';
export let socketPool: Pool;


const connectionManager = async (event: APIGatewayProxyWebsocketEventV2, context:AWSLambda.Context) => {
  const { requestContext:{ eventType} } = event
  
  if(eventType === 'CONNECT') {
    return connect(event)
  } else if(eventType ==='DISCONNECT') {
    return disconnect(event)
  }
}

const connect = async (event: APIGatewayProxyWebsocketEventV2) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'Artong hola!'})
  }
}

const disconnect = async (event: APIGatewayProxyWebsocketEventV2) => {
  socketPool= await getDbConnentionPool();
  const conn: PoolClient = await db.getSocketConnection();

  const { requestContext: { connectionId, } } = event
  
  try {
    const socket = new Socket({}, conn)

    await socket.deleteSocketConnection(connectionId)

    return { statusCode: 200 }
  } catch (error) {
    throw new InternalServerError(error, null)
  } finally {
    db.release(conn)
  }
}

/**
 * @description Init handler for websocket
 */
const initHandler = async (event: APIGatewayProxyWebsocketEventV2) => {
  socketPool= await getDbConnentionPool();
  const conn: PoolClient = await db.getSocketConnection();
  
  const { body, requestContext:{ domainName, stage, connectionId } } = event
  const { data: { connectorId }}= JSON.parse(body ?? '') as SocketBody
  const notificationModel = new Notification({},conn)
  const notifications = await notificationModel.selectNotifications(connectorId)

  try {
    const socket = new Socket({}, conn)
    const apigatewaymanagementapi = socket.getApiGatewayManagementApi({domainName, stage})
    const encoder = new TextEncoder()
    const data: CreateSocketConnectionBody = { connectionId, connectorId, domainName, stage }

    await socket.createSocketConnection(data)

    await apigatewaymanagementapi.postToConnection({
      ConnectionId: connectionId,
      Data: encoder.encode(JSON.stringify({ data: notifications }))
    })

    return { statusCode: 200 }
  } catch (error) {
    throw new InternalServerError(error, null)
  } finally {
    db.release(conn)
  }
}



export {
  connect,
  disconnect,
  connectionManager,
  initHandler,
}
