import { Member, Follow, Subscribe } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import { PoolClient } from 'pg';
import { BadRequest } from '../../utils/error/errors';

interface FollowInfo {
  isFollowRequest: boolean
  targetMemberId: number
}
const doFollowMemberOrUndo = async function(body: FollowInfo, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    if (member.id === body.targetMemberId) {
      throw new BadRequest('Cannot self follow', null);
    }

    const followModel = new Follow({
      followee_id: body.targetMemberId,
      follower_id: member.id,
    }, conn);

    let result = null;
    if (body.isFollowRequest) {
      result = await followModel.createFollow(
        followModel.followee_id,
        followModel.follower_id
      );
    } else {
      result = await followModel.deleteFollow(
        followModel.followee_id,
        followModel.follower_id
      );
    }

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

interface SubscribeInfo {
  isSubscribeRequest: boolean
  targetProjectAddress: string
}
const doSubsribeProjectOrUndo = async function(body: SubscribeInfo, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const subscribeModel = new Subscribe({
      member_id: member.id,
      project_address: body.targetProjectAddress,
    }, conn);

    let result = null;
    if (body.isSubscribeRequest) {
      result = await subscribeModel.createSubscribe(
        subscribeModel.member_id,
        subscribeModel.project_address
      );
    } else {
      result = await subscribeModel.deleteSubscribe(
        subscribeModel.member_id,
        subscribeModel.project_address
      );
    }

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

export {
	doFollowMemberOrUndo,
  doSubsribeProjectOrUndo,
};