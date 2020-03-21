const { pool } = require('../init');
const db = require('../utils/db/db');
const errors = require('../utils/error/errors');
const testSchema = require('../utils/validation/schema').testSchema;

const control = async function (body) {
  let result = {};
  let params = {};

  try {
    if (body) {
      body = await testSchema.validateAsync(body);
      params = body;
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