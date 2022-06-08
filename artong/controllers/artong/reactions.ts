import { ContentReactions } from '../../models/index';

const createContentReaction = async function(pathParameters: any, body: any, user: any) {
  const reaction = new ContentReactions({
    reaction_id: body.reaction_code,
    content_id: pathParameters.id,
    member_id: user.member_id
  });

  const result = await reaction.createContentReaction();

  return {'data': result}
}

export {
  createContentReaction,
};