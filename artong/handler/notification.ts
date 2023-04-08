import { SQSEvent } from 'aws-lambda';
import { Pool, PoolClient } from 'pg';
import * as db from '../utils/db/db';
import { Notification } from '../models';
import { getDbConnentionPool } from '../init';
export let dbConnectionPool: Pool;

export async function handler(event: SQSEvent) {
  // dbConnectionPool = await getDbConnentionPool();
  // const conn: PoolClient = await db.getConnection();
  // const notificationModel = new Notification({},conn)
  // for (const record of event.Records) {
  //   // const message = JSON.parse(record.body)
  //   const message = record.body
  //   // const receiveMessage = notificationModel.recvMessage(message)
  //   console.log('receiveMessage===>',message)
    
  // }
}
