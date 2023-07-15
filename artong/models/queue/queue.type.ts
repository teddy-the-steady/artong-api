import { NotificationTopic } from "../notification/notification.type";

type NotificationQueueBody = {
  topic: NotificationTopic;
  sender_id: number;
  receiver_id: number;
  content_id?: number| null;
}

export {
  NotificationQueueBody
}