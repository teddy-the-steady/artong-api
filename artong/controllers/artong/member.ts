import { PoolClient } from 'pg';
import { Member } from '../../models/index';
import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import validator from '../../utils/validators/common'

const getMember = async function(pathParameters: any) { // INFO] inner use only
  const conn: PoolClient = await db.getConnection();

  try {
    const id = typeof pathParameters.id === 'string' && pathParameters.id.includes('-')?
    { principal_id: pathParameters.id }
    :
    { id: pathParameters.id }

    const memberModel = new Member({
      ...id,
    }, conn);

    const result = await memberModel.getMember(
      memberModel.id,
      memberModel.principal_id
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error)
  } finally {
    db.release(conn);
  }
};

const getMemberByUsername = async function(pathParameters: any) {
  const conn: PoolClient = await db.getConnection();

  try {
    const memberModel = new Member({
      username: pathParameters.id
    }, conn);

    const result = await memberModel.getMemberByUsername(
      memberModel.username,
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error)
  } finally {
    db.release(conn);
  }
};

const getMembers = async function(queryStringParameters: any) {
  const conn: PoolClient = await db.getConnection();

  try {
    const memberModel = new Member({
      username: queryStringParameters?.username,
      principal_id: queryStringParameters?.principal_id
    }, conn);

    const result = await memberModel.getMembers(
      memberModel.username,
      memberModel.principal_id
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

interface MemberInfo {
  wallet_address: string
  principal_id: string
}
const postMember = async function(body: MemberInfo) {
  const conn: PoolClient = await db.getConnection();

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
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const patchMemberProfileS3key = async function(body: any, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const memberModel = new Member({
      id: member.id,
      profile_s3key: body.profile_s3key,
    }, conn);

    const result = await memberModel.updateMemberProfileS3keys(
      memberModel.id,
      memberModel.profile_s3key,
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const patchMemberProfileThumbnailS3key = async function(pathParameters: any, body: any) {
  const conn: PoolClient = await db.getConnection();

  try {
    const memberModel = new Member({
      id: pathParameters.id,
      profile_thumbnail_s3key: body.profile_thumbnail_s3key,
    }, conn);

    const result = await memberModel.updateMemberProfileS3keys(
      memberModel.id,
      memberModel.profile_s3key,
      memberModel.profile_thumbnail_s3key,
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const patchMember = async function(body: any, pathParameters: any, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const memberModel = new Member({
      id: pathParameters.id,
      username: body.username,
      introduction: body.introduction,
    }, conn);

    const result = await memberModel.updateMember(
      memberModel.id,
      memberModel.username,
      memberModel.introduction,
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const getProjectContributors = async function(pathParameters:any, queryStringParameters: any) {
  const conn: PoolClient = await db.getConnection();

  try {
    const memberModel = new Member({}, conn);

    const result = await memberModel.getProjectContributors(
      pathParameters.id,
      queryStringParameters.start_num,
      queryStringParameters.count_num,
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

export {
  getMember,
  getMemberByUsername,
  getMembers,
	postMember,
  patchMemberProfileS3key,
  patchMemberProfileThumbnailS3key,
  patchMember,
  getProjectContributors,
};