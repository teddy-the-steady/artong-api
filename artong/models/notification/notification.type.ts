const NotificationType = { 
  LIKE: 'LIKE', 
  CONTRIBUTE: 'CONTRIBUTE', 
  CONTRIBUTE_APPROVE: 'CONTRIBUTE_APPROVE'
}
type NotificationType = keyof typeof NotificationType

export {
  NotificationType
}