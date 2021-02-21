import * as db from '../utils/db/db';
import controllerErrorWrapper from '../utils/error/errorWrapper';
import { Member } from '../models/index';

const createMember = async function(body: any) {
  let result: any;
  let conn: any;

  try {
    const member = new Member({email: body.email});
    member.email = 'hello';
    console.log(member.email);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'Success'}
};

export {
	createMember,
};