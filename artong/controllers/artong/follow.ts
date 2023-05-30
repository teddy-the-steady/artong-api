import { Member, Follow, Subscribe, Notification } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import { PoolClient } from 'pg';
import { BadRequest } from '../../utils/error/errors';
import { Queue } from '../../models/queue/queue';
import { NotificationQueueBody } from '../../models/queue/queue.type';

interface FollowInfo {
  isFollowRequest: boolean
  targetMemberId: number
}
const doFollowMemberOrUndo = async function(body: FollowInfo, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

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

      if(member.id) {
        const queueModel = new Queue();
        const message: NotificationQueueBody = {
          noti_type:'FOLLOW_MEMBER',
          noti_message: `${member.username}님이 회원님을 팔로우하기 시작했습니다.`,
          receiver_id: body.targetMemberId,
          sender_id: member.id,
        }

        queueModel.pubMessage(message)
      }
    } else {
      result = await followModel.deleteFollow(
        followModel.followee_id,
        followModel.follower_id
      );
    }

    if (result) {
      const memberModel = new Member({}, conn);
      result = await memberModel.getMemberByMemberId(
        body.targetMemberId,
        member.id,
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
  targetProjectName: string
  targetProjectOwnerId:number
}
const doSubsribeProjectOrUndo = async function(body: SubscribeInfo, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

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
      
      if(member.id) {
        const queueModel= new Queue();
        const message: NotificationQueueBody= {
          noti_type: 'FOLLOW_PROJECT',
          noti_message: `${member.username}님이 ${body.targetProjectName} 프로젝트를 팔로우하기 시작했습니다.`,
          receiver_id: body.targetProjectOwnerId,
          sender_id: member.id,
        }

        queueModel.pubMessage(message)
      }
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