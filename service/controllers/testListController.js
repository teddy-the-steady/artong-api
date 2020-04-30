const {pool} = require('../init');
const db = require('../utils/db/db');
const {BadRequest, InternalServerError} = require('../../utils/error/errors');
const {MissingQueryParameter} = require('../../utils/error/errorCodes');
const testSchema = require('../utils/validation/schema').testSchema;

const control = async function (queryParameters) {
  let result = {};
  let params = {};

  try {
    if (queryParameters) {
      queryParameters = await testSchema.validateAsync(queryParameters);
      params = queryParameters;
    } else {
      throw new BadRequest("queryParameters needed")
    }
  } catch (error) {
    if (error instanceof BadRequest) {
      throw new BadRequest(error['errorMessage'])
    } else {
      throw new BadRequest(error, MissingQueryParameter)
    }
  }

  const conn = await db.getConnection(pool);

  try {
    result = await db.execute(conn, 'selectTestList', params);
  } catch (error) {
    console.log(error);
    throw new InternalServerError()
  } finally {
    db.release(conn);
  }

  return {"data": result}
};

module.exports.control = control;