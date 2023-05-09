const NotificationType = { 
  LIKE: 'LIKE', 
  CONTRIBUTE: 'CONTRIBUTE', 
  CONTRIBUTE_APPROVE: 'CONTRIBUTE_APPROVE',
  FOLLOW_MEMBER: 'FOLLOW_MEMBER',
  FOLLOW_PROJECT: 'FOLLOW_PROJECT',
}
type NotificationType = keyof typeof NotificationType
type QueueBody = {
  noti_type: NotificationType;
  sender_id: number;
  receiver_id: number;
  redirect_on_click?: string;
  noti_message: string;
  content_id?: number| null;
}
type SocketBody = {
  connectorId: number;
}
export {
  SocketBody,
  QueueBody,
  NotificationType
}