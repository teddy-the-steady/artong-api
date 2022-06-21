import validator from '../../utils/validators/common';
import { Member } from '../../models/index';

const getMember = async function(pathParameters: any) {
  const memberModel = new Member({
    auth_id: pathParameters.id
  });
  await validator(memberModel);
  const result = await memberModel.getMember(memberModel.auth_id);
  return {'data': result}
};

const getMemberAuthId = async function(params: any) {
  const memberModel = new Member({
    id: params.member_id
  });
  const result = await memberModel.getMemberAuthId(memberModel.id);
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
    wallet_address: body.wallet_address,
    auth_id: body.auth_id,
  });
  await validator(memberModel);
  const result = await memberModel.createMember(
    memberModel.auth_id,
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
  getMemberAuthId,
  getMembers,
	postMember,
  patchMemberProfilePic,
};