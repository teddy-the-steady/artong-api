import { PoolClient } from 'pg';
import { Member, Notification } from '../../models';
import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';

interface ReadNotifications {
  notificationIds: number[]
}

const getNotifications = async function (member: Member, skip?: number, take?: number) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const notificationModel = new Notification({}, conn);

    if(!member.id) return [] 

    const notifications = await notificationModel.selectNotificationsByMemberPK(member.id, skip, take);
    
    return await Promise.all(
      notifications.map(async (notification)=>{
        return notification.id && await notificationModel.notificationWrapper(notification.id) 
      })
    )
  } catch (error) {
    controllerErrorWrapper(error)
  } finally {
    db.release(conn);
  }
}

const readNotifications = async function (body: ReadNotifications) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const notificationModel = new Notification({}, conn);

    const result = await notificationModel.readNotifications(body.notificationIds);

    return { data: result }
  } catch (error) {
    controllerErrorWrapper(error)
  } finally {
    db.release(conn);
  }
}

export {
  getNotifications,
  readNotifications,
};
