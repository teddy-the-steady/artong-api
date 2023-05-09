import { APIGatewayProxyWebsocketEventV2 } from 'aws-lambda'
import * as db from '../utils/db/db';
import { Pool, PoolClient } from 'pg';
import { Notification } from '../models';
import { getDbConnentionPool } from '../init';
export let socketPool: Pool;

const connectionManager = async (event: APIGatewayProxyWebsocketEventV2, context:AWSLambda.Context) => {
  const { requestContext:{ eventType} } = event
  
  if(eventType === 'CONNECT') {
    connect(event, context)
    return {
      statusCode:200,
      body: 'connected'
    }
  } else if(eventType ==='DISCONNECT') {
    return disconnect(event)
    
  }
}

const connect = async (event: APIGatewayProxyWebsocketEventV2, context: AWSLambda.Context) => {
  socketPool= await getDbConnentionPool();
  const conn: PoolClient = await db.getSocketConnection();
  const notificationModel = new Notification({},conn)

  try{
    const result = await notificationModel.getNotificationList()
    return
  }catch(error){
  }
}

const disconnect = async (event: APIGatewayProxyWebsocketEventV2) => {
  return {
    statusCode: 200,
    body: 'disconnected'
  }
}

/**
 * @description default handler for websocket
 */
const defaultHandler = async (event:any) => {
  return {
    statusCode: 200,
    body: 'default'
  }
}
export {
  connect,
  disconnect,
  connectionManager,
  defaultHandler
}
