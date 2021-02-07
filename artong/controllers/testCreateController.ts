export {};
const {pool} = require('../init');
const db = require('../utils/db/db');
const {Forbidden} = require('../utils/error/errors');
const {NoPermission} = require('../utils/error/errorCodes');
const {controllerErrorWrapper} = require('../utils/error/errorWrapper');
const {hasPermission} = require('../utils/common/commonFunc');
const {validate, validateUser}  = require('../validators/common');
const {testSchema, userSchema} = require('../validators/schema/schema');

module.exports.control = async function (userId: string, userGroups: Array<string>, body: any) {
  let result: any;
  let params: any = {};
  let conn: any;

  try {
    if (!hasPermission(userGroups)) {
      throw new Forbidden(NoPermission.message, NoPermission.code)
    }

    params = await validate(body, testSchema);
    params['userId'] = await validateUser(userId, userSchema);
    
    conn = await db.getConnection(pool);
    await conn.beginTransaction();
    
    result = await db.execute(conn, 'test.insertTest', params);

    await conn.commit();
  } catch (error) {
    if (conn) await conn.rollback();
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }

  return {'data': 'Success'}
};