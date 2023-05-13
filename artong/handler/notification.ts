import { Pool, PoolClient } from 'pg';
import * as db from '../utils/db/db';
import { Notification } from '../models';
import { getDbConnentionPool } from '../init';
import { SQSEvent } from 'aws-lambda';
import { InternalServerError } from '../utils/error/errors';
import { } from '../models/notification/notification.type';
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
    for (const record of event.Records) {
      const message: NotificationQueueBody= JSON.parse(record.body)
      const {receiver_id} = message

      await notificationModel.createNotification(message)
      const connection = await socket.selectSocketConnection({connectorId: receiver_id})
      const endpoint = socket.generateEndpoint(connection.domain_name, connection.stage)

      connection.connection_id && await socket.sendMessageToClient(endpoint, connection.connection_id, { data: message})
    }
  } catch (error) {
    throw new InternalServerError(error, null)
  } finally {
    db.release(conn)
  }
}
