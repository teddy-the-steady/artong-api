export {};
const {pool} = require('../init');
const db = require('../utils/db/db');
const {BadRequest, InternalServerError} = require('../utils/error/errors');
const {MissingQueryParameter, ValidationError} = require('../utils/error/errorCodes');
const testSchema = require('../utils/validation/schema').testSchema;

const control = async function (queryParameters: any, pathParameters: {id: number}) {
  let result: any = {};
  let params: any = {id: pathParameters.id}
  
  try {
    if (queryParameters) {
      queryParameters = await testSchema.validateAsync(queryParameters);
      params['query'] = queryParameters
    }
  } catch (error) {
    if (error instanceof BadRequest) {
      throw new BadRequest(error['errorMessage'], error['errorCode'])
    } else if (error['details'] && error['details'][0]['message']) {
      throw new BadRequest(error['details'][0]['message'], MissingQueryParameter)
    } else {
      throw new BadRequest(error, ValidationError)
    }
  }

  const conn = await db.getConnection(pool);
  
  try {
    result = await db.execute(conn, 'selectTest', params);
  } catch (error) {
    console.error(error);
    if (error instanceof InternalServerError) {
      throw new InternalServerError(error['errorMessage'], error['errorCode'])
    } else if (error instanceof BadRequest) {
      throw new BadRequest(error['errorMessage'], error['errorCode'])
    } else {
      throw new InternalServerError()
    }
  } finally {
    db.release(conn);
  }

  return {'data': result[0]}
};

module.exports.control = control;