const init = require('../init');
const db = require('../utils/db/db');
const errors = require('../utils/error/errors');
const testSchema = require('../utils/validation/schema').testSchema;

const control = async function (queryParameters, pathParameters) {
  let result = {};
  let params = pathParameters
  
  try {
    if (queryParameters !== null) {
      queryParameters = await testSchema.validateAsync(queryParameters);
      params['query'] = queryParameters
    }
  } catch (error) {
    throw new errors.BadRequest(error.details[0].message, 400)
  }

  const conn = await db.getConnection(init.pool);
  
  try {
    result = await db.execute(conn, 'selectTest', params);
  } catch (error) {
    console.log(error);
    throw new errors.InternalServerError()
  } finally {
    db.release(conn);
  }

  return result
};

module.exports.control = control;