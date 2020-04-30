const {pool} = require('../../init');
const db = require('../../utils/db/db');
const {BadRequest, InternalServerError} = require('../../utils/error/errors');
const {MissingRequiredData} = require('../../utils/error/errorCodes');
const productSchema = require('../../utils/validation/schema').productSchema;
const userSchema = require('../../utils/validation/schema').userSchema;

const control = async function (userId, body) {
  let result = {};
  let params = {};

  try {
    if (userId && body) {
      body = await productSchema.validateAsync(body);
      params = body;
      
      let principalId = {'principalId': userId}
      principalId = await userSchema.validateAsync(principalId);
      params['userId'] = userId;
    } else {
      throw new BadRequest("userId or request body can't be null")
    }
  } catch (error) {
    if (error instanceof BadRequest) {
      throw new BadRequest(error['errorMessage'])
    } else {
      throw new BadRequest(error, MissingRequiredData)
    }
  }

  const conn = await db.getConnection(pool);

  try {
    await conn.beginTransaction();
    result = await db.execute(conn, 'productModels.insertProduct', params);
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