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
 * @description Init handler for websocket
 */
const initHandler = async (event: APIGatewayProxyWebsocketEventV2) => {
  socketPool= await getDbConnentionPool();
  const conn: PoolClient = await db.getSocketConnection();
  const notificationModel = new Notification({},conn)

  const { body, requestContext:{ domainName, stage, connectionId } } = event
  const { data: { connectorId }}= JSON.parse(body ?? '') as SocketBody

  const notifications = await notificationModel.selectNotifications(connectorId)
  const endpoint = process.env.IS_OFFLINE? 'http://localhost:3001': `https://${domainName}/${stage}`

  try {
    const socket = new Socket({}, conn)
    const data: CreateSocketConnectionBody = {
      connectionId,
      connectorId,
      created_at: new Date()
    }
    await socket.createSocketConnection(data)
    await socket.sendMessageToClient(endpoint,connectionId, notifications)

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
