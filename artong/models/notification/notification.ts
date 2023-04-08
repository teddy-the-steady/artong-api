import { PoolClient } from "pg";
import Models from "../Models";
import {SQS} from 'aws-sdk'
import * as db from "../../utils/db/db";
const sqs = new SQS({region: 'ap-northeast-2'})
const NotificationCategory = {
  LIKE: "LIKE",
};
type NotificationCategory = keyof typeof NotificationCategory;
type MessageBody = {
  category: string;
  sender_id: string;
  receiver_id: number;
  redirect_on_click: string;
  content: string;
}
class Notification extends Models {
  id?: number;
  category!: NotificationCategory;
  sender_id?: number;
  receiver_id?: number;
  read_at?: Date;
  redirect_on_click?: string;
  content?: string;
  created_at?: Date;
  updated_at?: Date;
  //
  constructor(data: Partial<Notification> = {}, conn: PoolClient) {
    super(conn);
    Object.assign(this, data);
  }

  sendMessage(messageBody: MessageBody) {
    const params: SQS.SendMessageRequest={
      MessageBody: `${messageBody}`,
      QueueUrl: process.env.NOTIFICATION_QUEUE_URL ?? ''
    }

    try {
      sqs.sendMessage(params)
    } catch (error) {
      throw error
    }
  }

  recvMessage(message: MessageBody) {

  }
}

export { Notification, NotificationCategory };
