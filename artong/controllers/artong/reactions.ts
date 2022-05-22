import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import { ContentReactions } from '../../models/index';
const insertContentReactions = require('../../models/reactions/insertContentReactions.sql')

const createContentReaction = async function(pathParameters: any, body: any, user: any) {
  let conn: any;
  
  try {
    const reaction = new ContentReactions({
      reaction_id: body.reaction_code,
      content_id: pathParameters.id,
      member_id: user.member_id
    });

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    await db.execute(conn, insertContentReactions, reaction);

    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'success'}
}

export {
  createContentReaction,
};