import { Pool, PoolClient } from 'pg';
import * as db from '../utils/db/db';
import { Notification } from '../models';
import { getDbConnentionPool } from '../init';
import { SQSEvent } from 'aws-lambda';
import { MessageBody } from '../models/notification/Notification';

export let notiPool: Pool;

export async function handler(event: SQSEvent) {
  notiPool = await getDbConnentionPool();
  const conn: PoolClient = await db.getNotiConnection();
  const notificationModel = new Notification({},conn)
  //test1aa
  for (const record of event.Records) {
    const message: MessageBody = JSON.parse(record.body)
    if (message.noti_type === 'LIKE') {
      notificationModel.recvLike(message)
    }
  }
}
