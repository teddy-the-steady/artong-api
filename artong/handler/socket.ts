import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda'
import * as db from '../utils/db/db';
import { Pool, PoolClient } from 'pg';
import { Notification } from '../models';
import { getDbConnentionPool } from '../init';
import { SocketBody } from '../models/notification/notification.type';
import { InternalServerError } from '../utils/error/errors';
import { ApiGatewayManagementApi } from '@aws-sdk/client-apigatewaymanagementapi';
export let socketPool: Pool;

const connectionManager = async (event: APIGatewayProxyWebsocketEventV2, context:AWSLambda.Context) => {
  const { requestContext:{ eventType} } = event
  
  if(eventType === 'CONNECT') {
    return connect()
  } else if(eventType ==='DISCONNECT') {
    return disconnect()
  }
}

const connect = async () => {
  return {
    statusCode: 200,
    body: 'Artong halo!'
  }
}

const disconnect = async () => {
  return {
    statusCode: 200,
    body: 'Artong adios!'
  }
}

/**
 * @description default handler for websocket
 */
const defaultHandler = async (event: APIGatewayProxyWebsocketEventV2) => {
  socketPool= await getDbConnentionPool();
  const conn: PoolClient = await db.getSocketConnection();
  const notificationModel = new Notification({},conn)

  const { body, requestContext:{domainName,stage,connectionId} } = event
  const { connectorId }= JSON.parse(body ?? '') as SocketBody

  const notifications = await notificationModel.selectNotifications(connectorId)
  const endpoint = process.env.IS_OFFLINE? 'http://localhost:3001': `https://${domainName}/${stage}`

  try {
    await sendMessageToClient(endpoint,connectionId, notifications)

    return { statusCode: 200 }
  } catch (error) {
    throw new InternalServerError(error, null)
  } finally {
    db.release(conn)
  }
}


const sendMessageToClient = async (endpoint: string, connectionId: string, payload: {}[]) => {
    const apiGatewayManagementApi = new ApiGatewayManagementApi({ apiVersion: '2018-11-29', endpoint })
    const encoder = new TextEncoder()

    try{
      return await apiGatewayManagementApi.postToConnection({
        ConnectionId: connectionId,
        Data: encoder.encode(JSON.stringify(payload))
      })
    }catch(error){
      throw new InternalServerError(error, null)
    }
  }

export {
  connect,
  disconnect,
  connectionManager,
  defaultHandler,
  sendMessageToClient
}
