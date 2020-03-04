const init = require('../init');
const db = require('../utils/db/db');
const InternalServerError = require('../utils/error/errors').InternalServerError;

const control = async function (queryParameters) {
  let result = {};

  const conn = await db.getConnection(init.pool);

  try {
    result = await db.execute(conn, 'selectProductList');
  } catch (error) {
    console.log(error);
    throw new InternalServerError()
  } finally {
    db.release(conn);
  }

  return result
};

module.exports.control = control;