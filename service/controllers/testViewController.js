const db = require('../utils/db/db');
const InternalServerError = require('../utils/error/errors').InternalServerError;

const control = async function (pool, queryParameters, pathParameters) {
  let result = {};
  const params = {id: pathParameters.id};

  const conn = await db.getConnection(pool);
  
  try {
    result = await db.execute(pool, 'selectProduct', params);
  } catch (error) {
    console.log(error);
    throw new InternalServerError()
  } finally {
    db.release(conn);
  }

  return result
};

module.exports.control = control;