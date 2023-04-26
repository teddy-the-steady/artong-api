import { Pool, PoolClient } from 'pg';
import * as db from '../utils/db/db';
import { Notification } from '../models';
import { getDbConnentionPool } from '../init';
import { SQSEvent } from 'aws-lambda';
import { MessageBody } from '../models/notification/Notification';
import { InternalServerError } from '../utils/error/errors';

export let notiPool: Pool;

export async function handler(event: SQSEvent, context: AWSLambda.Context, callback: AWSLambda.Callback) {
  console.log(event.Records)
  notiPool = await getDbConnentionPool();
  const conn: PoolClient = await db.getNotiConnection();
  const notificationModel = new Notification({},conn)
  try {
    for (const record of event.Records) {
      const message: MessageBody = JSON.parse(record.body)
      notificationModel.receiveMessage(message)
    }
  } catch(error) {
    throw new InternalServerError(error, null)
  }
}
