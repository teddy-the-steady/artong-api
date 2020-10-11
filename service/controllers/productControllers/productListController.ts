import init from '../../init'
import {getConnection, release, execute} from '../../utils/db/db'
import {BadRequest, InternalServerError} from '../../utils/error/errors'
import {MissingQueryParameter, MissingRequiredData, ValidationError} from '../../utils/error/errorCodes'
import schema from '../../utils/validation/schema'

const control = async function (queryParameters: any) {
  let result = {};
  let params = {};

  try {
    if (queryParameters) {
      queryParameters = await schema.productListSchema.validateAsync(queryParameters);
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

  const conn = await getConnection(init.pool);

  try {
    result = await execute(conn, 'productModels.selectProductList', params);
  } catch (error) {
    console.error(error);
    if (error instanceof InternalServerError) {
      throw new InternalServerError(error['errorMessage'], error['errorCode'])
    } else if (error instanceof BadRequest) {
      throw new BadRequest(error['errorMessage'], error['errorCode'])
    } else {
      throw new InternalServerError('', null)
    }
  } finally {
    release(conn);
  }

  return {'data': result}
};

module.exports.control = control;