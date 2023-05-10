import { SQS, SendMessageRequest } from "@aws-sdk/client-sqs";
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { PoolClient } from "pg";
import * as db from "../../utils/db/db";
import Models from "../Models";
import { NotificationType} from "./notification.type";
import { InternalServerError } from "../../utils/error/errors";
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { NotificationQueueBody } from "../queue/queue.type";

const insertNotification = require('./insertNotification.sql')
const selectNotifications = require('./selectNotifications.sql')

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

  async createNotification (body:NotificationQueueBody) {
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
}

export { Notification };

