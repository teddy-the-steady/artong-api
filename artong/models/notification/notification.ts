import { PoolClient } from "pg";
import Models from "../Models";

export class Notification extends Models {
  id?: number;
  sender_id?: number;
  receiver_id?: number;
  read_at?: Date;
  content?: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: Partial<Notification> = {}, conn: PoolClient) {
    super(conn);
    Object.assign(this, data);
  }
}
