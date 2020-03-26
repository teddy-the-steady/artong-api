const { pool } = require('../init');
const db = require('../utils/db/db');
const errors = require('../utils/error/errors');
const testSchema = require('../utils/validation/schema').testSchema;
const userSchema = require('../utils/validation/schema').userSchema;

const control = async function (userId, body) {
  let result = {};
  let params = {};

  try {
    if (userId && body) {
      body = await testSchema.validateAsync(body);
      params = body;

      let principalId = {'principalId': userId}
      principalId = await userSchema.validateAsync(principalId);
      params['userId'] = userId;
    }
  } catch (error) {
    throw new errors.BadRequest(error.details[0].message, 400)
  }

  const conn = await db.getConnection(pool);

  try {
    await conn.beginTransaction();
    result = await db.execute(conn, 'insertTest', params);
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    console.log(error);
    throw new errors.InternalServerError()
  } finally {
    db.release(conn);
  }

  return result
};

module.exports.control = control;