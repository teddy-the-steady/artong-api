export {};
const db = require('../utils/db/db');
const {controllerErrorWrapper} = require('../utils/error/errorWrapper');

module.exports.control = async function(queryParameters: any) {
  let result: any;
  let params: any = {};
  let conn: any;

  try {
    conn = await db.getConnection();

    result = await db.execute(conn, 'test.selectTestList', params);
  } catch (error) {
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }

  return {'data': result}
};