const NotificationTopic = { 
  LIKE: 'LIKE', 
  CONTRIBUTE: 'CONTRIBUTE', 
  CONTRIBUTE_APPROVE: 'CONTRIBUTE_APPROVE',
  FOLLOW_MEMBER: 'FOLLOW_MEMBER',
  FOLLOW_PROJECT: 'FOLLOW_PROJECT',
}
type NotificationTopic = keyof typeof NotificationTopic
type NotificationSender = {
  id: number;
  username: string;
  profile_thumbnail_s3key: string;
}
type NotificationReceiver = {
  id: number;
  username: string;
  profile_thumbnail_s3key: string;
}

type NotificationWrapper = {
  id: number;
  topic: NotificationTopic;
  read_at?: Date;
  created_at: Date;
  from : {
    member: NotificationSender;
  }
  to: {
    member: NotificationReceiver; 
  }
  content?: {
    id: number;
    tokenId: string;
    name: string;
    content_thumbnail_s3key: string;
    redeem: boolean;
    project: {
      name: string;
      address: string;
      project_thumbnail_s3key: string;
      slug: string;
    }
  }
}

export {
  NotificationTopic,
  NotificationWrapper
}