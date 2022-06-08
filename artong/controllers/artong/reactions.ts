import { ContentReactions } from '../../models/index';

interface ContentReactionsInfo {
  reaction_id: number;
	content_id: number;
	member_id: number;
}

const createContentReaction = async function(pathParameters: any, body: any, user: any) {
  const reaction = new ContentReactions();

  const result = await reaction.createContentReaction({
    reaction_id: body.reaction_code,
    content_id: pathParameters.id,
    member_id: user.member_id
  });

  return {'data': result}
}

export {
  ContentReactionsInfo,
  createContentReaction,
};