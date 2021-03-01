import * as db from '../utils/db/db';
import controllerErrorWrapper from '../utils/error/errorWrapper';
import validator from '../utils/validators/common';
import { MemberMaster, MemberDetail } from '../models/index';
const insertMemberMaster = require('../models/member/insertMemberMaster.sql');
const insertMemberDetail = require('../models/member/insertMemberDetail.sql');
const updateMemberMaster = require('../models/member/updateMemberMaster.sql');

const createMember = async function(body: any) {
  let conn: any;

  try {
    const memberMaster = new MemberMaster({
      email: body.email,
      auth_id: body.auth_id,
    });
    await validator(memberMaster);
    memberMaster.username = memberMaster.email.split('@')[0];

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    const insertedId = await db.execute(conn, insertMemberMaster, memberMaster);
    const memberDetail = new MemberDetail({
      member_id: insertedId[0].id,
      language_id: body.language_id || 1, // FE가 파악후 전달(기본값 1)
    });
    await db.execute(conn, insertMemberDetail, memberDetail);

    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'success'}
};

const patchMemberMaster = async function(pathParameters: any, body: any) {
  let conn: any;
  
  try {
    const memberMaster = new MemberMaster({
      id: pathParameters.id,
      username: body.username,
      status_id: body.status_id,
      is_email_verified: body.is_email_verified,
    });

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    await db.execute(conn, updateMemberMaster, memberMaster);

    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'success'}
}

export {
	createMember,
  patchMemberMaster,
};