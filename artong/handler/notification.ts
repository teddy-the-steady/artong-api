import { Pool, PoolClient } from 'pg';
import * as db from '../utils/db/db';
import { Notification } from '../models';
import { getDbConnentionPool } from '../init';

let dbConnectionPool: Pool;

export async function handler(event: any) {
  dbConnectionPool = await getDbConnentionPool();
  const conn: PoolClient = await db.getConnection();
  const notificationModel = new Notification({},conn)

  for (const record of event.Records) {
    const message = JSON.parse(record.body)
    const receiveMessage = notificationModel.recvMessage(message)
  }
}
