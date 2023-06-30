import { NotificationCategory } from "../notification/notification.type";

type NotificationQueueBody = {
  category: NotificationCategory;
  sender_id: number;
  message: string;
  receiver_id: number;
  redirect_on_click?: string;
  content_id?: number| null;
}

export {
  NotificationQueueBody
}