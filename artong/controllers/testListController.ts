export {};
const {pool} = require('../init');
const db = require('../utils/db/db');
const {controllerErrorWrapper} = require('../utils/error/errorWrapper');

module.exports.control = async function (queryParameters: any) {
  let result: any;
  let params: any = {};
  let conn: any;

  try {
    // conn = await db.getConnection(pool);

    pool.connect((err: any , client: any, done: any) => {
      if (err) throw err;
      client.query('SELECT * FROM artong.test', (err: any, res: any) => {
          done();
          if (err) {
              console.log(err.stack);
          } else {
              for (let row of res.rows) {
                  console.log(row);
              }
          }
      });
    });

    // result = await db.execute(conn, 'test.selectTestList', params);
  } catch (error) {
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }

  return {'data': result}
};