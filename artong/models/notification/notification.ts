import { PoolClient } from "pg";
import Models from "../Models";
import * as db from "../../utils/db/db";
const insertNotification = require("./insertNotification.sql");

type NotificationCategory = "like";
export class Notification extends Models {
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

  async createNotification(
    category: NotificationCategory,
    sender_id: number,
    receiver_id: number,
    content: string,
    redirect_on_click?: string
  ) {
    try {
      const result = await db.execute(this.conn, insertNotification, {
        category,
        sender_id,
        receiver_id,
        content,
        redirect_on_click,
      });
      return result[0];
    } catch (error) {
      throw error;
    }
  }
}
