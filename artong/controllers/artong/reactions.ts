import { PoolClient } from 'pg';
import { ContentReactions, Member, Notification } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import validator from '../../utils/validators/common';
interface ReactionBody {
  reaction_code: string;
}
const postContentReaction = async function(pathParameters: any, body: ReactionBody, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const reactionModel = new ContentReactions({
      content_id: pathParameters.id,
      member_id: member.id,
    }, conn);

    await validator(reactionModel)

    let result = await reactionModel.createContentReaction(
      body.reaction_code,
      reactionModel.content_id,
      reactionModel.member_id
    );
    
    if (isValidReaction(body.reaction_code)) {
      (result as any).total_likes = await getTotalLikes(reactionModel, result.content_id)
    }

    if(isLike(body.reaction_code)) {
      const notificationModel = new Notification({}, conn)
      const noti_message = `${member.username}님이 좋아요를 눌렀습니다.`

      notificationModel.sendMessage({
        noti_type: 'LIKE',
        sender_id: member.id, 
        receiver_id: result.member_id, 
        noti_message, 
        content_id: result.content_id
      })
    }

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const getTotalLikes = async (model:ContentReactions, content_id:number) => {
  return (await model.getTotalLikesByContent(content_id)).total_likes;
}

const isValidReaction=(reaction_code: string) => ['LIKE', 'UNLIKE'].includes(reaction_code.toUpperCase());
const isLike = (reaction_code: string) => reaction_code.toUpperCase() === 'LIKE';

export {
  postContentReaction,
};