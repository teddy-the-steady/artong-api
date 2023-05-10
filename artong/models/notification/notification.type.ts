const NotificationType = { 
  LIKE: 'LIKE', 
  CONTRIBUTE: 'CONTRIBUTE', 
  CONTRIBUTE_APPROVE: 'CONTRIBUTE_APPROVE',
  FOLLOW_MEMBER: 'FOLLOW_MEMBER',
  FOLLOW_PROJECT: 'FOLLOW_PROJECT',
}
type NotificationType = keyof typeof NotificationType

type SocketBody = {
  connectorId: number;
}
export {
  SocketBody,
  NotificationType
}