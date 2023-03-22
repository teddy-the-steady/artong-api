import { PoolClient } from "pg";
import Models from "../Models";
import * as db from "../../utils/db/db";
import { CreateNotificationDto } from "../../controllers/artong/notification/notification.dto";
const insertNotification = require("./insertNotification.sql");

const NotificationCategory = {
  LIKE: "LIKE",
};
type NotificationCategory = keyof typeof NotificationCategory;
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

  constructor(data: Partial<Notification> = {}, conn: PoolClient) {
    super(conn);
    Object.assign(this, data);
  }

  async createNotification(data: CreateNotificationDto) {
    try {
      const result = await db.execute(this.conn, insertNotification, data);
      return result[0];
    } catch (error) {
      throw error;
    }
  }
}

export { Notification, NotificationCategory };
