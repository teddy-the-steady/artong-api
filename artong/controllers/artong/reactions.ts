import { ContentReactions, Member } from '../../models/index';

const postContentReaction = async function(pathParameters: any, body: any, member: Member) {
  const reactionModel = new ContentReactions({
    reaction_id: body.reaction_code,
    content_id: pathParameters.id,
    member_id: member.id
  });

  const result = await reactionModel.createContentReaction(
    reactionModel.reaction_id,
    reactionModel.content_id,
    reactionModel.member_id
  );

  return {'data': result}
}

export {
  postContentReaction,
};