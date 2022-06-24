import { Member } from '../../models/index';

const getMember = async function(pathParameters: any) {
  const memberModel = new Member(
    typeof pathParameters.id === 'string' && pathParameters.id.startsWith('0x')?
    { wallet_address: pathParameters.id }
      :
    { id: pathParameters.id }
  );
  const result = await memberModel.getMember(
    memberModel.id,
    memberModel.wallet_address
  );
  return {'data': result}
};

const getMembers = async function(queryStringParameters: any) {
  const memberModel = new Member({
    username: queryStringParameters.username
  });
  const result = await memberModel.getMembers(memberModel.username);
  return {'data': result}
};

const postMember = async function(body: any) {
  const memberModel = new Member({
    username: body.wallet_address,
    wallet_address: body.wallet_address
  });
  const result = await memberModel.createMember(
    memberModel.username,
    memberModel.wallet_address
  );
  return {'data': result}
};

const patchMemberProfilePic = async function(pathParameters: any, body: any) {
  const memberModel = new Member({
    id: pathParameters.id,
    profile_pic: body.profile_pic
  });
  const result = await memberModel.updateMemberProfilePic(
    memberModel.id,
    memberModel.profile_pic
  );
  return {'data': result}
};

export {
  getMember,
  getMembers,
	postMember,
  patchMemberProfilePic,
};