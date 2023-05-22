import { Pool, PoolClient } from 'pg';
import * as db from '../utils/db/db';
import { Notification } from '../models';
import { getDbConnentionPool } from '../init';
import { SQSEvent } from 'aws-lambda';
import { InternalServerError } from '../utils/error/errors';
import { NotificationQueueBody } from '../models/queue/queue.type';
import { Socket } from '../models/socket/Socket';

export let notiPool: Pool;

export async function handler(event: SQSEvent, context: AWSLambda.Context, callback: AWSLambda.Callback) {
  console.log(event.Records)
  notiPool = await getDbConnentionPool();
  
  const conn: PoolClient = await db.getNotiConnection();
  const notificationModel = new Notification({},conn)
  const socket = new Socket({}, conn)

  try {
    await Promise.all(
      event.Records.map(async (record)=>{
        const message: NotificationQueueBody= JSON.parse(record.body)
        const {receiver_id} = message

        await notificationModel.createNotification(message)

        const {domain_name: domainName, stage, connection_id} = await socket.selectSocketConnection({connectorId: receiver_id})

        // Send notification to receiver if receiver is online
        if(connection_id) {
          const apigatewaymanagementapi = socket.getApiGatewayManagementApi({domainName, stage})
          const encoder = new TextEncoder()

          await apigatewaymanagementapi.postToConnection({
            ConnectionId: connection_id,
            Data: encoder.encode(JSON.stringify({ data: message }))
          })
        }
      })
    )
  } catch (error) {
    throw new InternalServerError(error, null)
  } finally {
    db.release(conn)
  }
}
