import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import validator from '../../utils/validators/common';
import { MemberMaster, MemberDetail } from '../../models/index';
import { Forbidden } from '../../utils/error/errors';
import { NoPermission } from '../../utils/error/errorCodes';
const insertMemberMaster = require('../../models/member/insertMemberMaster.sql');
const insertMemberDetail = require('../../models/member/insertMemberDetail.sql');
const updateMemberMaster = require('../../models/member/updateMemberMaster.sql');
const updateMemberDetail = require('../../models/member/updateMemberDetail.sql');
const updateMemberProfilePic = require('../../models/member/updateMemberProfilePic.sql');
const selectMemberSecure = require('../../models/member/selectMemberSecure.sql');
const selectMember = require('../../models/member/selectMember.sql');
const selectMemberAuthId = require('../../models/member/selectMemberAuthId.sql');
const selectMemberOfUsername = require('../../models/member/selectMemberOfUsername.sql');
import { plainToClass } from 'class-transformer';

const getMember = async function(pathParameters: any) {
  let result: any;
  let conn: any;

  try {
    conn = await db.getConnection();
    result = await db.execute(conn, selectMember, pathParameters);
  } catch (error) {
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': result[0]}
};

const getMemberSecure = async function(pathParameters: any) {
  let result: any;
  let conn: any;

  try {
    const member = plainToClass(MemberMaster, {
      auth_id: pathParameters.auth_id
    });
    await validator(member);

    conn = await db.getConnection();
    result = await db.execute(conn, selectMemberSecure, member);
  } catch (error) {
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': result[0]}
};

const createMember = async function(body: any) {
  let conn: any;

  try {
    const memberMaster = plainToClass(MemberMaster, {
      email: body.email,
      auth_id: body.auth_id,
      username: body.email.split('@')[0],
    })
    await validator(memberMaster);

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    const memberOfUsername = await db.execute(conn, selectMemberOfUsername, { username: memberMaster.username });
    if (memberOfUsername.length > 0) {
      memberMaster.username += '+'
    }
    const insertedId = await db.execute(conn, insertMemberMaster, memberMaster);
    const memberDetail = plainToClass(MemberDetail, {
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

const patchMemberMaster = async function(body: any, user: any) {
  let conn: any;
  
  try {
    const memberMaster = plainToClass(MemberMaster, {
      id: user.member_id,
      username: body.username,
      status_id: body.status_id
    });
    await validator(memberMaster);

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    const updatedId = await db.execute(conn, updateMemberMaster, memberMaster);
    if (!updatedId.length) throw new Forbidden(NoPermission.message, NoPermission.code);

    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'success'}
};

const patchMemberDetail = async function(body: any, user: any) {
  let conn: any;
  
  try {
    const memberDetail = plainToClass(MemberDetail, {
      member_id: user.member_id,
      given_name: body.given_name,
      family_name: body.family_name,
      zip_code: body.zip_code,
      address: body.address,
      address_detail: body.address_detail,
      birthday: body.birthday,
      introduction: body.introduction,
      profile_pic: body.profile_pic,
      language_id: body.language_id,
      phone_number: body.phone_number,
      country_id: body.country_id,
    });
    await validator(memberDetail);

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
};

const patchMemberProfilePic = async function(pathParameters: any, body: any) {
  let conn: any;

  try {
    const memberMaster = plainToClass(MemberMaster, {
      username: pathParameters.username,
    });
    const memberDetail = plainToClass(MemberDetail, {
      profile_pic: body.profile_pic,
    });
    await validator(memberMaster);
    await validator(memberDetail);
    const memberMasterAndDetail = memberMaster.pourObjectIntoMemberMaster(memberDetail);

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    await db.execute(conn, updateMemberProfilePic, memberMasterAndDetail);

    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'success'}
};

const getMemberAuthId = async function(params: any) {
  let result: any;
  let conn: any;

  try {
    conn = await db.getConnection();
    result = await db.execute(conn, selectMemberAuthId, params);
  } catch (error) {
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': result[0]}
};

const getMemberOfUsername = async function(queryStringParameters: any) {
  let result: any;
  let conn: any;

  try {
    conn = await db.getConnection();
    result = await db.execute(conn, selectMemberOfUsername, queryStringParameters);
  } catch (error) {
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': result[0]}
};

export {
  getMember,
  getMemberSecure,
	createMember,
  patchMemberMaster,
  patchMemberDetail,
  patchMemberProfilePic,
  getMemberAuthId,
  getMemberOfUsername,
};