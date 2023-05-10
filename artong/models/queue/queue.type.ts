import { NotificationType } from "../notification/notification.type";

type NotificationQueueBody = {
  noti_type: NotificationType;
  sender_id: number;
  receiver_id: number;
  redirect_on_click?: string;
  noti_message: string;
  content_id?: number| null;
}

export {
  NotificationQueueBody
}