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

    let result = await reactionModel.createContentReaction(
      body.reaction_code,
      reactionModel.content_id,
      reactionModel.member_id
    );

    if (result && ['like', 'unlike'].includes(body.reaction_code.toLowerCase())) {
      (result as any).total_likes = (await reactionModel.getTotalLikesByContent(
        result.content_id
      )).total_likes;
    }

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