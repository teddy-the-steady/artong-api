import { PoolClient } from "pg";
import * as db from "../../utils/db/db";
import Models from "../Models";
import { InternalServerError } from "../../utils/error/errors";
import { NotificationQueueBody } from "../queue/queue.type";
import { NotificationTopic, NotificationWrapper } from "./notification.type";

const insertNotification = require('./insertNotification.sql')
const selectNotifications = require('./selectNotifications.sql')
const selectNotificationByPrimaryKey = require('./selectNotificationByPrimaryKey.sql')
const updateNotifications = require('./updateNotifications.sql')


class Notification extends Models {
  id?: number;
  receiver_id!: number;
  sender_id!: number;
  topic!: NotificationTopic;
  content_id?: number;
  redirect_on_click?: string;
  read_at?: Date;
  created_at!: Date;
  updated_at?: Date;

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

  async selectNotificationsByMemberPK(memberId: number, page: number = 1):Promise<Notification[]> {
    const take = 10
    const skip = (page-1) * take

    try {
      const result = await db.execute(this.conn, selectNotifications,{ 
        memberId,
        skip,
        take
      })
      return result
    } catch(error) {
      throw new InternalServerError(error, null)
    } 
  }

  async selectNotificationByPrimaryKey(id: number): Promise<any>{
    try {
      const result = await db.execute(this.conn, selectNotificationByPrimaryKey, { id })
      return result[0]
    } catch(error) {
      throw new InternalServerError(error, null)
    }
  }

  async readNotifications(notificationIds: number[]) {
    try {
      return await db.execute(this.conn, updateNotifications, { 
        readAt: new Date(),
        updatedAt: new Date(), 
        notificationIds
      })
    } catch(error) {
      throw new InternalServerError(error,null)
    }
  }

  async notificationWrapper(id: number): Promise<NotificationWrapper | void> {
    const notification = await this.selectNotificationByPrimaryKey(id)

    return {
      id,
      topic: notification.topic,
      redirect_on_click: notification.redirect_on_click,
      read_at: notification.read_at,
      created_at: notification.created_at,
      from: {
        member: {
          id: notification.sender_id,
          username: notification.sender_username,
          profile_thumbnail_s3key: notification.sender_profile_thumbnail_s3key,
        }
      },
      to: {
        member: {
          id: notification.receiver_id,
          username: notification.receiver_username,
          profile_thumbnail_s3key: notification.receiver_profile_thumbnail_s3key
        }
      },
      content: notification.content_id ? {
        id: notification.content_id,
        content_thumbnail_s3key: notification.content_thumbnail_s3key,
      } : null
    }
  }
}

export { Notification };

