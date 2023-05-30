import { APIGatewayProxyWebsocketEventV2, Callback } from 'aws-lambda'
import * as db from '../utils/db/db';
import { Pool, PoolClient } from 'pg';
import { getDbConnentionPool } from '../init';
import { InternalServerError } from '../utils/error/errors';
import { Socket } from '../models/socket/Socket';
import requestInit from '../utils/http/request';
export let socketPool: Pool;


const connectionManager = async (event: APIGatewayProxyWebsocketEventV2, context:any, callback:Callback) => {
  const { requestContext:{ eventType } } = event
  
  if (eventType === 'CONNECT') {
    // Must set callback before initConnection process
    callback(null, { statusCode: 200 })

    await initConnection(event).catch((error)=>callback(error, null))
  } else if (eventType === 'DISCONNECT') {
    await disposalConnection(event).catch((error)=> callback(error,null))

    callback(null, { statusCode: 200 }) 
  }
}

const initConnection = async (event: APIGatewayProxyWebsocketEventV2) => {
  socketPool= await getDbConnentionPool();
  const conn: PoolClient = await db.getSocketConnection();
  const { requestContext:{ domainName, stage, connectionId } } = event

  try {
    const req = await requestInit(event, conn)
    const connectorId = req.member.id
    
    const socket = new Socket({}, conn)
    await socket.createSocketConnection({ connectionId, connectorId, domainName, stage })
  } catch (error) {
    throw new InternalServerError(error, null)
  } finally {
    db.release(conn)
  }
}

const disposalConnection = async (event: APIGatewayProxyWebsocketEventV2) => {
  socketPool= await getDbConnentionPool();
  const conn: PoolClient = await db.getSocketConnection();

  const { requestContext: { connectionId } } = event
  
  try {
    const socket = new Socket({}, conn)

    await socket.deleteSocketConnection(connectionId)
  } catch (error) {
    throw new InternalServerError(error, null)
  } finally {
    db.release(conn)
  }
}

export {
  initConnection,
  disposalConnection,
  connectionManager,
}
