export {};
const db = require('../../utils/db/db');
const {controllerErrorWrapper} = require('../../utils/error/errorWrapper');
const {Member} = require('../../models');

module.exports.control = async function(body: any) {
  let result: any;
  let conn: any;

  try {
    const member = new Member({email: body.email});

    member.email = 'hello'
    
    console.log(member.email)
    // conn = await db.getConnection();
    // await db.beginTransaction(conn);
    
    // result = await db.execute(conn, 'test.insertTest', test);

    // await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }

  return {'data': 'Success'}
};