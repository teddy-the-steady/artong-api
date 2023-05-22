import { PoolClient } from 'pg';
import * as db from '../../utils/db/db';
import { Notification } from '../../models';
import { InternalServerError } from '../../utils/error/errors';
import controllerErrorWrapper from '../../utils/error/errorWrapper';

interface ReadNotifications {
  notificationIds: number[]
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
  readNotifications
}