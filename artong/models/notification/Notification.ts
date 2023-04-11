import { PoolClient } from "pg";
import Models from "../Models";
import * as db from "../../utils/db/db";
import { SQS, SendMessageRequest } from "@aws-sdk/client-sqs";

const insertNotification = require('./insertNotification.sql')

const sqs = new SQS({region: 'ap-northeast-2'})
type NotificationCategory = 'LIKE'
type MessageBody = {
  category: NotificationCategory;
  sender_id: number;
  receiver_id: number;
  redirect_on_click?: string;
  content: string;
}
class Notification extends Models {
  id?: number;
  category!: NotificationCategory;
  sender_id?: number;
  receiver_id?: number;
  read_at?: Date;
  redirect_on_click?: string | null;
  content?: string;
  created_at?: Date;
  updated_at?: Date;
  
  constructor(data: Partial<Notification> = {}, conn: PoolClient) {
    super(conn);
    Object.assign(this, data);
  }

  async createNotification (messageBody: MessageBody) {
    try{
      const result = await db.execute(this.conn, insertNotification, messageBody)
      
      return result[0]
    } catch(error){
      throw error
    } 
  }

  sendMessage(messageBody: MessageBody) {
    const params: SendMessageRequest={
      MessageBody: JSON.stringify(messageBody),
      QueueUrl: process.env.NOTIFICATION_QUEUE_URL ?? 'artong-notification-queue'
    }

    try {
      return sqs.sendMessage(params)
    } catch (error) {
      throw error
    }
  }

  recvMessage(message: MessageBody) {

  }
}

export { Notification, NotificationCategory };
