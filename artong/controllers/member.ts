import * as db from '../utils/db/db';
import controllerErrorWrapper from '../utils/error/errorWrapper';
import validator from '../utils/validators/common';
import { MemberMaster, MemberDetail } from '../models/index';
const insertMemberMaster = require('../models/member/insertMemberMaster.sql');
const insertMemberDetail = require('../models/member/insertMemberDetail.sql');
const updateMemberMaster = require('../models/member/updateMemberMaster.sql');
const updateMemberDetail = require('../models/member/updateMemberDetail.sql');

const getMember = async function(pathParameters: any) {
  let conn: any;

  try {
    
  } catch (error) {
    
  } finally {
    
  }
}

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

const patchMemberDetail = async function(pathParameters: any, body: any) {
  let conn: any;
  
  try {
    const memberDetail = new MemberDetail({
      member_id: pathParameters.member_id,
      given_name: body.given_name,
      family_name: body.family_name,
      zip_code: body.zip_code,
      address: body.address,
      address_detail: body.address_detail,
      birthday: body.birthday,
      introduction: body.introduction,
      profile_pic: body.profile_pic,
      language_id: body.language_id,
      last_activity_at: body.last_activity_at,
      phone_number: body.phone_number,
      country_id: body.country_id,
    });

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    await db.execute(conn, updateMemberDetail, memberDetail);

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
  getMember,
	createMember,
  patchMemberMaster,
  patchMemberDetail,
};