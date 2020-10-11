export {};
const {pool} = require('../../init');
const db = require('../../utils/db/db');
const {BadRequest, InternalServerError} = require('../../utils/error/errors');
const {MissingQueryParameter, MissingRequiredData, ValidationError} = require('../../utils/error/errorCodes');
const productListSchema = require('../../utils/validation/schema').productListSchema;

const control = async function (queryParameters: any) {
  let result = {};
  let params = {};

  try {
    if (queryParameters) {
      queryParameters = await productListSchema.validateAsync(queryParameters);
      params = queryParameters;
    } else {
      throw new BadRequest(MissingRequiredData.message, MissingRequiredData.code)
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
    result = await db.execute(conn, 'productModels.selectProductList', params);
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

  return {'data': result}
};

module.exports.control = control;