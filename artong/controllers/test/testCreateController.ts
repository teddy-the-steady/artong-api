export {};
const db = require('../../utils/db/db');
const {controllerErrorWrapper} = require('../../utils/error/errorWrapper');
const {validate} = require('../../utils/validators/common')
const Test = require('../../models/test/Test');

module.exports.control = async function(body: any) {
  let result: any;
  let conn: any;

  try {
    await validate(body, Test.testSchema);

    const test = new Test({name: body.name, value: body.value});
    
    conn = await db.getConnection();
    await db.beginTransaction(conn);
    
    result = await db.execute(conn, 'test.insertTest', test);

    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }

  return {'data': 'Success'}
};