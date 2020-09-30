export {};
const {pool} = require('../init');
const db = require('../utils/db/db');
const {BadRequest, InternalServerError} = require('../utils/error/errors');
const {MissingRequiredData, ValidationError} = require('../utils/error/errorCodes');
const testSchema = require('../utils/validation/schema').testSchema;
const userSchema = require('../utils/validation/schema').userSchema;

const control = async function (userId: string, body: any) {
  let result = {};
  let params: any = {};

  try {
    if (userId && body) {
      body = await testSchema.validateAsync(body);
      params = body;

      let principalId = {'principalId': userId}
      principalId = await userSchema.validateAsync(principalId);
      params['userId'] = userId;
    } else {
      throw new BadRequest('userId or request body cannot be null', MissingRequiredData)
    }
  } catch (error) {
    if (error instanceof BadRequest) {
      throw new BadRequest(error['errorMessage'], error['errorCode'])
    } else if (error['details'] && error['details'][0]['message']) {
      throw new BadRequest(error['details'][0]['message'], MissingRequiredData)
    } else {
      throw new BadRequest(error, ValidationError)
    }
  }

  const conn = await db.getConnection(pool);

  try {
    await conn.beginTransaction();
    result = await db.execute(conn, 'insertTest', params);
    await conn.commit();
  } catch (error) {
    await conn.rollback();
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

  return {'data': 'Success'}
};

module.exports.control = control;