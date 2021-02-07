export {};
const {pool} = require('../init');
const db = require('../utils/db/db');
const {controllerErrorWrapper} = require('../utils/error/errorWrapper');
const {validate}  = require('../utils/validators/common');
const {testSchema} = require('../utils/validators/schema/schema');

module.exports.control = async function (pathParameters: {id: string}, queryParameters: any) {
  let result: any;
  let params: any = {id: pathParameters.id}
  let conn: any;
    
  try {
    params = await validate(queryParameters, testSchema);

    conn = await db.getConnection(pool);

    result = await db.execute(conn, 'test.selectTest', params);
  } catch (error) {
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }

  return {'data': result[0]}
};