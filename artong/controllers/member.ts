import * as db from '../utils/db/db';
import controllerErrorWrapper from '../utils/error/errorWrapper';
import validator from '../utils/validators/common';
import { MemberMaster } from '../models/index';
const insertMemberMaster = require('../models/member/insertMemberMaster.sql');

const createMemberMaster = async function(body: any) {
  let conn: any;

  try {
    const member = new MemberMaster({
      email: body.email,
      auth_id: body.auth_id,
    });
    await validator(member);
    member.username = member.email.split('@')[0];

    conn = await db.getConnection();
    await db.beginTransaction(conn);
    await db.execute(conn, insertMemberMaster, member);
    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'success'}
};

export {
	createMemberMaster,
};