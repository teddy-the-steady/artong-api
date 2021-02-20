export {};
const db = require('../../utils/db/db');
const {controllerErrorWrapper} = require('../../utils/error/errorWrapper');
const Test = require('../../models/test/Test');

module.exports.control = async function(pathParameters: {id: number}, queryParameters: any) {
  let result: any;
  let conn: any;
    
  try {
    const test = new Test({id: pathParameters.id});

    conn = await db.getConnection();

    result = await db.execute(conn, 'test.selectTest', test);
  } catch (error) {
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }

  return {'data': result[0]}
};