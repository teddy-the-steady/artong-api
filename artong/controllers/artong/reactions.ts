import { PoolClient } from 'pg';
import { ContentReactions, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';

const postContentReaction = async function(pathParameters: any, body: any, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const reactionModel = new ContentReactions({
      content_id: pathParameters.id,
      member_id: member.id,
    }, conn);

    const result = await reactionModel.createContentReaction(
      body.reaction_code,
      reactionModel.content_id,
      reactionModel.member_id
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

export {
  postContentReaction,
};