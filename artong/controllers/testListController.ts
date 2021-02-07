export {};
const {pool} = require('../init');
const db = require('../utils/db/db');
const {controllerErrorWrapper} = require('../utils/error/errorWrapper');
const {validate}  = require('../validators/common');
const {testSchema} = require('../validators/schema/schema');

module.exports.control = async function (queryParameters: any) {
  let result: any;
  let params: any = {};
  let conn: any;

  try {
    params = await validate(queryParameters, testSchema);

    conn = await db.getConnection(pool);

    result = await db.execute(conn, 'test.selectTestList', params);
  } catch (error) {
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }

  return {'data': result}
};