const init = require('../init');
const db = require('../utils/db/db');
const InternalServerError = require('../utils/error/errors').InternalServerError;
const BadRequest = require('../utils/error/errors').BadRequest;
const productSchema = require('../utils/validation/schema').productSchema;

const control = async function (body) {
  let result = {};
  const params = body;

  try {
    params = await productSchema.validateAsync(params);
  } catch (error) {
    throw new BadRequest(error.details[0].message, 400)
  }

  const conn = await db.getConnection(init.pool);

  try {
    await conn.beginTransaction();
    result = await db.execute(conn, 'insertProduct', params);
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    console.log(error);
    throw new InternalServerError()
  } finally {
    db.release(conn);
  }

  return result
};

module.exports.control = control;