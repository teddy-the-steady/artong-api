import { PoolClient } from "pg";
import * as db from "../../utils/db/db";
import { Notification } from "../../models/notification/Notification";
import controllerErrorWrapper from "../../utils/error/errorWrapper";

interface INotification {
  type: string;
}
const postNotification = async function (body: INotification) {
  const conn: PoolClient = await db.getConnection();

  try {
    const notificationModel = new Notification({}, conn);
    const notification = await notificationModel.createNotification(body);

    return { data: notification };
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

export { postNotification };
