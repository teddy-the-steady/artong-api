import { SQS, SendMessageRequest } from "@aws-sdk/client-sqs";
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { PoolClient } from "pg";
import * as db from "../../utils/db/db";
import Models from "../Models";

const insertNotification = require('./insertNotification.sql')

const sqs = new SQS({region: 'ap-northeast-2'})
const NotificationType = { LIKE: 'LIKE', }
type NotificationType = keyof typeof NotificationType
type MessageBody = {
  noti_type: NotificationType;
  sender_id: number;
  receiver_id: number;
  redirect_on_click?: string;
  noti_message: string;
  content_id: number;
}
class Notification extends Models {
  @IsInt()
  id!: number;
  @IsEnum(NotificationType)
  category!: NotificationType;
  @IsInt()
  sender_id!: number;
  @IsInt()
  receiver_id!: number;
  @IsDate()
  @IsOptional()
  read_at?: Date;
  @IsString()
  @IsOptional()
  redirect_on_click?: string | null;
  @IsString()
  @IsOptional()
  content!: string;
  @IsDate()
  created_at!: Date;
  @IsDate()
  @IsOptional()
  updated_at?: Date | null;
  
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
      QueueUrl: process.env.NOTIFICATION_QUEUE_URL 
    }
    
    try {
      return sqs.sendMessage(params)
    } catch (error) {
      throw error
    }
  }

  async recvLike(messageBody: MessageBody) {
    return await this.createNotification(messageBody)
  }
}

export { Notification, NotificationType as NotificationCategory };

