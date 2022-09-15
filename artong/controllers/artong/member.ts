import { Client } from 'pg';
import { Member } from '../../models/index';
import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import validator from '../../utils/validators/common'

const getMember = async function(pathParameters: any) {
  const conn: Client = await db.getConnection();

  try {
    const id = typeof pathParameters.id === 'string' && pathParameters.id.startsWith('0x')?
    { wallet_address: pathParameters.id }
    :
    { id: pathParameters.id }

    const memberModel = new Member({
      ...id,
    }, conn);

    const result = await memberModel.getMember(
      memberModel.id,
      memberModel.wallet_address
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error)
  } finally {
    db.release(conn);
  }
};

const getMembers = async function(queryStringParameters: any) {
  const conn: Client = await db.getConnection();

  try {
    const memberModel = new Member({
      username: queryStringParameters?.username,
      principal_id: queryStringParameters?.principal_id
    }, conn);

    const result = await memberModel.getMembers(
      memberModel.username,
      memberModel.principal_id
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const postMember = async function(body: any) {
  const conn: Client = await db.getConnection();

  try {
    const memberModel = new Member({
      username: body.wallet_address?.toLowerCase(),
      wallet_address: body.wallet_address?.toLowerCase(),
      principal_id: body.principal_id,
    }, conn);

    await validator(memberModel);

    const result = await memberModel.createMember(
      memberModel.username,
      memberModel.wallet_address,
      memberModel.principal_id,
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const patchMemberProfilePic = async function(pathParameters: any, body: any) {
  const conn: Client = await db.getConnection();

  try {
    const memberModel = new Member({
      id: pathParameters.id,
      profile_pic: body.profile_pic,
    }, conn);

    const result = await memberModel.updateMemberProfilePic(
      memberModel.id,
      memberModel.profile_pic
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

export {
  getMember,
  getMembers,
	postMember,
  patchMemberProfilePic,
};