import { SQS, SendMessageRequest } from "@aws-sdk/client-sqs";
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { PoolClient } from "pg";
import * as db from "../../utils/db/db";
import Models from "../Models";
import { NotificationType, QueueBody } from "./notification.type";
import { InternalServerError } from "../../utils/error/errors";
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";

const insertNotification = require('./insertNotification.sql')
const selectNotifications = require('./selectNotifications.sql')

const sqs = new SQS({region: 'ap-northeast-2'})
class Notification extends Models {
  @IsInt()
  id!: number;
  @IsEnum(NotificationType)
  noti_type!: NotificationType;
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
  noti_message!: string;
  @IsInt()
  @IsOptional()
  content_id?: number | null;
  @IsDate()
  created_at!: Date;
  @IsDate()
  @IsOptional()
  updated_at?: Date | null;
  
  constructor(data: Partial<Notification> = {}, conn: PoolClient) {
    super(conn);
    Object.assign(this, data);
  }

  async createNotification (body:QueueBody) {
    try{
      const result = await db.execute(this.conn, insertNotification, body)
      
      return result[0]
    } catch(error){
      console.error('create notification error', error)
      throw new InternalServerError(error, null)
    } 
  }

  async selectNotifications(connectorId: number) {
    try{
      return await db.execute(this.conn, selectNotifications,{connectorId})
    } catch(error){
      throw new InternalServerError(error, null)
    } 
  }

  pubQueue(body: QueueBody) {
    const params: SendMessageRequest={
      MessageBody: JSON.stringify(body),
      QueueUrl: process.env.NOTIFICATION_QUEUE_URL 
    }
    
    try {
      return sqs.sendMessage(params)
    } catch (error) {
      throw error
    }
  }

  async subQueue(body:QueueBody) {
    return await this.createNotification(body)
  }

  

  async sendNotificationsToClient(endpoint: string, connectionId: string, payload: {}[]) {
    const apiGatewayManagementApi = new ApiGatewayManagementApi({ apiVersion: '2018-11-29', endpoint })
    const encoder = new TextEncoder()

    try{
      return await apiGatewayManagementApi.postToConnection({
        ConnectionId: connectionId,
        Data: encoder.encode(JSON.stringify(payload))
      })
    }catch(error){
      throw new InternalServerError(error, null)
    }
  }
}

export { Notification };

